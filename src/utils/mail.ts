import nodemailer from 'nodemailer';
import { Env } from '@/libs/Env';
import { logger } from '@/libs/Logger';

const createTransporter = () => {
  const host = Env.SMTP_HOST;
  const port = Env.SMTP_PORT;
  const user = Env.SMTP_USER;
  const pass = Env.SMTP_PASSWORD;

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  return null;
};

const transporter = createTransporter();
const fromAddress = Env.SMTP_FROM || 'Okunpedia Auth <noreply@okunpedia.org>';
const appUrl = Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Sends a signup email verification link to a user.
 * @param email Recipient email address.
 * @param token Verification token.
 */
export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationLink = `${appUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  const subject = 'Verify your Okunpedia Account';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #111827; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Welcome to Okunpedia</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
        Thank you for signing up. Please click the button below to verify your email address and activate your account:
      </p>
      <div style="margin-bottom: 24px;">
        <a href="${verificationLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 6px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px; line-height: 20px;">
        If you did not request this, please ignore this email. This verification link will expire in 24 hours.
      </p>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">
        If the button above does not work, copy and paste this URL into your browser: <br />
        <a href="${verificationLink}" style="color: #2563eb; word-break: break-all;">${verificationLink}</a>
      </p>
    </div>
  `;

  if (transporter) {
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject,
      html,
    });
  } else {
    logger.info(`[MOCK EMAIL] Verification email to ${email}. Link: ${verificationLink}`);
  }
}

/**
 * Sends a password reset verification link to a user.
 * @param email Recipient email address.
 * @param token Reset password token.
 */
export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetLink = `${appUrl}/reset-password?token=${token}`;
  const subject = 'Reset your Okunpedia Password';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #111827; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Reset Password Request</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
        We received a request to reset your password. Click the button below to choose a new password:
      </p>
      <div style="margin-bottom: 24px;">
        <a href="${resetLink}" style="background-color: #dc2626; color: #ffffff; padding: 12px 24px; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 6px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px; line-height: 20px;">
        If you did not request a password reset, you can safely ignore this email. This link will expire in 1 hour.
      </p>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">
        If the button above does not work, copy and paste this URL into your browser: <br />
        <a href="${resetLink}" style="color: #dc2626; word-break: break-all;">${resetLink}</a>
      </p>
    </div>
  `;

  if (transporter) {
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject,
      html,
    });
  } else {
    logger.info(`[MOCK EMAIL] Password reset email to ${email}. Link: ${resetLink}`);
  }
}

/**
 * Sends a notification email regarding a new account login.
 * @param email User's email.
 * @param ipAddress IP address of the login request.
 * @param userAgent Browser/Device user agent string.
 * @param time Time of the login.
 */
export async function sendNewLoginAlert(
  email: string,
  ipAddress: string,
  userAgent: string,
  time: Date
): Promise<void> {
  const subject = 'Security Alert: New Login to Okunpedia';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #dc2626; font-size: 20px; font-weight: bold; margin-bottom: 16px;">New Login Detected</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
        A new sign-in was detected for your account:
      </p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Date & Time:</td>
          <td style="padding: 8px 0; color: #111827;">${time.toUTCString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">IP Address:</td>
          <td style="padding: 8px 0; color: #111827;">${ipAddress}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Browser/Device:</td>
          <td style="padding: 8px 0; color: #111827;">${userAgent}</td>
        </tr>
      </table>
      <p style="color: #6b7280; font-size: 14px; line-height: 20px;">
        If this was you, no action is needed. If you do not recognize this sign-in, please reset your password immediately in your account settings.
      </p>
    </div>
  `;

  if (transporter) {
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject,
      html,
    });
  } else {
    logger.info(`[MOCK EMAIL] Security login alert sent to ${email} (IP: ${ipAddress})`);
  }
}
