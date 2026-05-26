import { compare } from 'bcryptjs';
import { eq, and, sql } from 'drizzle-orm';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { headers } from 'next/headers';
import { db } from '@/libs/DB';
import { userTable, loginActivityTable } from '@/models/Schema';
import { authConfig } from './auth.config';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const reqHeaders = await headers();
        const ipAddress =
          reqHeaders.get('x-forwarded-for') || reqHeaders.get('x-real-ip') || '127.0.0.1';
        const userAgent = reqHeaders.get('user-agent') || 'Unknown';

        // Brute-force protection: check recent failed attempts for this IP
        const [failedCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(loginActivityTable)
          .where(
            and(
              eq(loginActivityTable.ipAddress, ipAddress),
              eq(loginActivityTable.status, 'failed'),
              sql`created_at > NOW() - INTERVAL '15 minutes'`,
            ),
          );

        if (failedCount && Number(failedCount.count) >= 5) {
          throw new Error('Too many failed login attempts. Please try again in 15 minutes.');
        }

        const [user] = await db
          .select()
          .from(userTable)
          .where(eq(userTable.email, (credentials.email as string).toLowerCase().trim()))
          .limit(1);

        if (!user || !user.password) {
          await db.insert(loginActivityTable).values({
            userId: null,
            ipAddress,
            userAgent,
            status: 'failed',
          });
          throw new Error('Invalid email or password.');
        }

        const isPasswordValid = await compare(credentials.password as string, user.password);

        if (!isPasswordValid) {
          await db.insert(loginActivityTable).values({
            userId: user.id,
            ipAddress,
            userAgent,
            status: 'failed',
          });
          throw new Error('Invalid email or password.');
        }

        if (user.status === 'BLOCKED') {
          throw new Error('Your account has been blocked.');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role ?? 'USER',
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      const reqHeaders = await headers();
      const ipAddress =
        reqHeaders.get('x-forwarded-for') || reqHeaders.get('x-real-ip') || '127.0.0.1';
      const userAgent = reqHeaders.get('user-agent') || 'Unknown';

      const email = user.email?.toLowerCase().trim();
      if (!email) {
        return false;
      }

      // Check if user already exists
      const [dbUser] = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);

      if (!dbUser || dbUser.status === 'BLOCKED') {
        return false;
      }

      // Log successful login activity
      await db.insert(loginActivityTable).values({
        userId: dbUser.id,
        ipAddress,
        userAgent,
        status: 'success',
      });

      return true;
    },
    jwt({ token, user, trigger, session }) {
      // Run base configuration jwt callback first
      return authConfig.callbacks.jwt({ token, user, trigger, session });
    },
  },
});
