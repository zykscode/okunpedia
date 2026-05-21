'use server';

import { db } from '@/libs/DB';
import { userTable } from '@/models/Schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;

  if (!email || !password || !name) {
    return { error: 'All fields are required' };
  }

  try {
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (existingUser) {
      return { error: 'Email already registered' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create unique ID
    const userId = crypto.randomUUID();

    // Insert into DB
    await db.insert(userTable).values({
      id: userId,
      email,
      name,
      password: hashedPassword,
      role: 'USER',
      status: 'ACTIVE',
    });

    return { success: true };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { error: 'Failed to create account. Please try again.' };
  }
}
