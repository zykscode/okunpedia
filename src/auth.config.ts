import type { NextAuthConfig } from 'next-auth';
import 'next-auth/jwt';

export const authConfig = {
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user.role || 'USER').trim();
        token.isEmailVerified = !!user.emailVerified;
      }
      // Handle update session events (e.g. from security/profile page)
      if (trigger === 'update' && session) {
        if (session.name) {
          token.name = session.name;
        }
        if (session.image) {
          token.picture = session.image;
        }
        if (session.isEmailVerified !== undefined) {
          token.isEmailVerified = session.isEmailVerified;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string || 'USER').trim();
        session.user.isEmailVerified = token.isEmailVerified as boolean;
      }
      return session;
    },
  },
  providers: [], // Providers are added in auth.ts to avoid Node dependencies in Edge runtime
} satisfies NextAuthConfig;
