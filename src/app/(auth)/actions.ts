'use server';

/* eslint-disable jsdoc/require-returns, import/no-named-as-default-member, require-unicode-regexp, @typescript-eslint/no-explicit-any, jsdoc/require-param */

import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { eq, and, sql } from 'drizzle-orm';
import { AuthError } from 'next-auth';
import { auth, signIn } from '@/auth';
import { db } from '@/libs/DB';
import {
  userTable,
  verificationTokensTable,
  passwordResetTokensTable,
  userProfilesSchema,
} from '@/models/Schema';
import { sendVerificationEmail, sendPasswordResetEmail } from '@/utils/mail';
import { SignUpValidation, SignInValidation } from '@/validations/AuthValidation';

const COMMON_PASSWORDS = [
  'password123',
  'password12345',
  '123456789012',
  'qwertyuiopasdf',
  'administrator1',
  'change_me_now1',
];

/**
 * Validates strength of a password according to rules.
 * @param password The password to test.
 * @param email The user's email to check similarity.
 */
function validatePasswordStrength(
  password: string,
  email: string,
): { isValid: boolean; message: string } {
  if (password.length < 12) {
    return {
      isValid: false,
      message: 'Password must be at least 12 characters long.',
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter.',
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter.',
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number.',
    };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character.',
    };
  }

  // Similarity checking
  const emailPrefix = email.split('@')[0] || '';
  if (
    password.toLowerCase().includes(emailPrefix.toLowerCase()) ||
    password.toLowerCase().includes(email.toLowerCase())
  ) {
    return {
      isValid: false,
      message: 'Password must not be similar to your email address.',
    };
  }

  // Reject weak passwords
  if (COMMON_PASSWORDS.some((p) => password.toLowerCase().includes(p))) {
    return {
      isValid: false,
      message: 'Password is too common. Please choose a stronger one.',
    };
  }

  return { isValid: true, message: 'Password is valid.' };
}

/**
 * Log in a user using credentials.
 */
export async function signInAction(formData: FormData) {
  const emailRaw = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = SignInValidation.safeParse({
    email: emailRaw,
    password,
  });

  if (!result.success) {
    return { error: result.error.issues[0]?.message || 'Invalid inputs.' };
  }

  const { email, password: pw } = result.data;

  try {
    await signIn('credentials', {
      email,
      password: pw,
      redirectTo: '/dashboard',
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      const errMsg = error.cause?.err?.message || error.message || 'Invalid email or password.';
      return { error: errMsg };
    }
    // Throw NextJS redirect error
    throw error;
  }
}

/**
 * Registers a new user with username, email, and password.
 * @param formData Form values including username, email, password, and confirmPassword.
 */
export async function signUpAction(formData: FormData) {
  const usernameRaw = formData.get('username') as string;
  const emailRaw = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const result = SignUpValidation.safeParse({
    username: usernameRaw,
    email: emailRaw,
    password,
    confirmPassword,
  });

  if (!result.success) {
    const errorMsg = result.error.issues[0]?.message || 'Invalid inputs.';
    return { error: errorMsg };
  }

  const { username, email } = result.data;

  try {
    // Unique email check
    const [existingUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (existingUser) {
      return { error: 'Email already registered.' };
    }

    // Unique username check
    const [existingProfile] = await db
      .select()
      .from(userProfilesSchema)
      .where(eq(userProfilesSchema.username, username))
      .limit(1);

    if (existingProfile) {
      return { error: 'Username already taken.' };
    }

    // Rate limiting: check how many signups from verification tokens in past 10 minutes
    const [rateCheck] = await db
      .select({ count: sql<number>`count(*)` })
      .from(verificationTokensTable)
      .where(and(eq(verificationTokensTable.identifier, email), sql`expires > NOW()`));

    if (rateCheck && rateCheck.count >= 3) {
      return {
        error: 'Too many registration attempts. Please try again later.',
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = `usr_${Math.random().toString(36).slice(2, 11)}_${Date.now().toString(36)}`;

    // Create user and profile atomically
    await db.transaction(async (tx) => {
      await tx.insert(userTable).values({
        id: userId,
        email,
        name: username,
        password: hashedPassword,
        role: 'USER',
        status: 'ACTIVE',
        emailVerified: new Date(),
        updatedAt: new Date(),
      });

      await tx.insert(userProfilesSchema).values({
        id: userId,
        username,
        role: 'member',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { error: 'Failed to create account. Please try again.' };
  }
}

/**
 * Verifies email using a valid signup verification token.
 * @param token The token from the verification link.
 * @param email The target user email.
 */
export async function verifyEmailAction(token: string, email: string) {
  if (!token || !email) {
    return { error: 'Invalid parameters.' };
  }

  try {
    const formattedEmail = email.toLowerCase().trim();

    // Query token
    const [tokenRecord] = await db
      .select()
      .from(verificationTokensTable)
      .where(
        and(
          eq(verificationTokensTable.token, token),
          eq(verificationTokensTable.identifier, formattedEmail),
        ),
      )
      .limit(1);

    if (!tokenRecord) {
      return { error: 'Invalid or expired verification token.' };
    }

    if (tokenRecord.expires < new Date()) {
      // Clean up expired token
      await db.delete(verificationTokensTable).where(eq(verificationTokensTable.token, token));
      return {
        error: 'Verification token has expired. Please request a new one.',
      };
    }

    // Update user status
    await db
      .update(userTable)
      .set({ emailVerified: new Date(), updatedAt: new Date() })
      .where(eq(userTable.email, formattedEmail));

    // Delete token
    await db.delete(verificationTokensTable).where(eq(verificationTokensTable.token, token));

    return { success: true };
  } catch (error) {
    console.error('Email verification error:', error);
    return { error: 'Failed to verify email. Please try again.' };
  }
}

/**
 * Resends a verification email for a user if they are currently unverified.
 * @param email User email address.
 */
export async function resendVerificationAction(email: string) {
  if (!email) {
    return { error: 'Email address is required.' };
  }
  const formattedEmail = email.toLowerCase().trim();

  try {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, formattedEmail))
      .limit(1);

    if (!user) {
      return { error: 'No account found with this email address.' };
    }
    if (user.emailVerified) {
      return { error: 'Your email address is already verified.' };
    }

    // Rate Limit: delete existing pending tokens for this email to prevent spam
    await db
      .delete(verificationTokensTable)
      .where(eq(verificationTokensTable.identifier, formattedEmail));

    // Create new token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.insert(verificationTokensTable).values({
      identifier: formattedEmail,
      token,
      expires,
    });

    await sendVerificationEmail(formattedEmail, token);
    return { success: true };
  } catch (error) {
    console.error('Resend verification error:', error);
    return { error: 'Failed to send verification email.' };
  }
}

/**
 * Generates and sends a password reset token.
 * @param email Target user email address.
 */
export async function forgotPasswordAction(email: string) {
  if (!email) {
    return { error: 'Email is required.' };
  }
  const formattedEmail = email.toLowerCase().trim();

  try {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, formattedEmail))
      .limit(1);

    // For security reasons, do not reveal if email is not found
    if (!user) {
      return { success: true };
    }

    if (!user.password) {
      return {
        error: 'This account does not have password credentials configured.',
      };
    }

    // Rate limit: delete past reset tokens for the email
    await db
      .delete(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.email, formattedEmail));

    // Token expires in 1 hour
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await db.insert(passwordResetTokensTable).values({
      email: formattedEmail,
      token,
      expires,
    });

    await sendPasswordResetEmail(formattedEmail, token);
    return { success: true };
  } catch (error) {
    console.error('Forgot password action error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}

/**
 * Resets user password using reset token.
 * @param formData Form values including token, password, confirmPassword.
 */
export async function resetPasswordAction(formData: FormData) {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!token || !password || !confirmPassword) {
    return { error: 'All fields are required.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  try {
    const [resetRecord] = await db
      .select()
      .from(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.token, token))
      .limit(1);

    if (!resetRecord) {
      return { error: 'Invalid or expired password reset token.' };
    }

    if (resetRecord.expires < new Date()) {
      await db.delete(passwordResetTokensTable).where(eq(passwordResetTokensTable.token, token));
      return { error: 'Reset token has expired.' };
    }

    // Enforce password strength
    const passValidation = validatePasswordStrength(password, resetRecord.email);
    if (!passValidation.isValid) {
      return { error: passValidation.message };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password
    await db
      .update(userTable)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(userTable.email, resetRecord.email));

    // Delete token
    await db.delete(passwordResetTokensTable).where(eq(passwordResetTokensTable.token, token));

    return { success: true };
  } catch (error) {
    console.error('Reset password action error:', error);
    return { error: 'Failed to reset password.' };
  }
}

/**
 * Changes contributor password or handles account setting updates.
 * @param formData Form containing security settings updates (currentPassword, newPassword, confirmNewPassword).
 */
export async function updateSecuritySettingsAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Unauthorized.' };
  }

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmNewPassword = formData.get('confirmNewPassword') as string;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return { error: 'All fields are required.' };
  }

  if (newPassword !== confirmNewPassword) {
    return { error: 'New passwords do not match.' };
  }

  try {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, session.user.id))
      .limit(1);

    if (!user || !user.password) {
      return { error: 'Account not configured with password auth.' };
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return { error: 'Current password is incorrect.' };
    }

    const passValidation = validatePasswordStrength(newPassword, user.email);
    if (!passValidation.isValid) {
      return { error: passValidation.message };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db
      .update(userTable)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(userTable.id, session.user.id));

    return { success: true };
  } catch (error) {
    console.error('Security settings update error:', error);
    return { error: 'Failed to update security settings.' };
  }
}
