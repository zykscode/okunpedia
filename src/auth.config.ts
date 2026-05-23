import type { NextAuthConfig, DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isEmailVerified: boolean;
      isOAuth: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: string;
    emailVerified?: Date | null;
    isOAuth?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    isEmailVerified?: boolean;
    isOAuth?: boolean;
  }
}

export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
        token.isEmailVerified = !!user.emailVerified;
        token.isOAuth = !!user.isOAuth;
      }
      // Handle update session events (e.g. from security/profile page)
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
        if (session.isEmailVerified !== undefined) {
          token.isEmailVerified = session.isEmailVerified;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      return session;
    },
  },
  providers: [], // Providers are added in auth.ts to avoid Node dependencies in Edge runtime
} satisfies NextAuthConfig;
