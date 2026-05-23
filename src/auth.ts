import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/libs/DB";
import { userTable, accountsTable, loginActivityTable } from "@/models/Schema";
import { authConfig } from "./auth.config";
import { headers } from "next/headers";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const [user] = await db
          .select()
          .from(userTable)
          .where(
            eq(
              userTable.email,
              (credentials.email as string).toLowerCase().trim(),
            ),
          )
          .limit(1);

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        if (user.status === "BLOCKED") {
          throw new Error("Your account has been blocked.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role ?? "USER",
          emailVerified: user.emailVerified,
          isOAuth: false,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      const reqHeaders = await headers();
      const ipAddress =
        reqHeaders.get("x-forwarded-for") ||
        reqHeaders.get("x-real-ip") ||
        "127.0.0.1";
      const userAgent = reqHeaders.get("user-agent") || "Unknown";

      if (account?.provider === "google") {
        const email = user.email?.toLowerCase().trim();
        if (!email) return false;

        // Check if user already exists
        let [dbUser] = await db
          .select()
          .from(userTable)
          .where(eq(userTable.email, email))
          .limit(1);

        if (dbUser) {
          if (dbUser.status === "BLOCKED") {
            return false;
          }

          // If email is not yet verified in DB, mark verified as Google email is pre-verified
          if (!dbUser.emailVerified) {
            await db
              .update(userTable)
              .set({ emailVerified: new Date(), updatedAt: new Date() })
              .where(eq(userTable.id, dbUser.id));
          }

          // Check if Google account connection exists
          const [link] = await db
            .select()
            .from(accountsTable)
            .where(
              and(
                eq(accountsTable.provider, "google"),
                eq(accountsTable.providerAccountId, account.providerAccountId),
              ),
            )
            .limit(1);

          if (!link) {
            await db.insert(accountsTable).values({
              userId: dbUser.id,
              type: account.type as string,
              provider: account.provider as string,
              providerAccountId: account.providerAccountId as string,
              refresh_token: (account.refresh_token as string) || null,
              access_token: (account.access_token as string) || null,
              expires_at: account.expires_at
                ? Number(account.expires_at)
                : null,
              token_type: (account.token_type as string) || null,
              scope: (account.scope as string) || null,
              id_token: (account.id_token as string) || null,
              session_state: (account.session_state as string) || null,
            });
          }
        } else {
          // Auto-create new user
          const newId = `usr_${Math.random().toString(36).slice(2, 11)}_${Date.now().toString(36)}`;
          await db.insert(userTable).values({
            id: newId,
            email,
            name: user.name || email.split("@")[0],
            image: user.image || null,
            role: "USER",
            status: "ACTIVE",
            emailVerified: new Date(),
            updatedAt: new Date(),
          });

          await db.insert(accountsTable).values({
            userId: newId,
            type: account.type as string,
            provider: account.provider as string,
            providerAccountId: account.providerAccountId as string,
            refresh_token: (account.refresh_token as string) || null,
            access_token: (account.access_token as string) || null,
            expires_at: account.expires_at ? Number(account.expires_at) : null,
            token_type: (account.token_type as string) || null,
            scope: (account.scope as string) || null,
            id_token: (account.id_token as string) || null,
            session_state: (account.session_state as string) || null,
          });
        }
      }

      // Log successful login activity
      const [finalUser] = await db
        .select({ id: userTable.id })
        .from(userTable)
        .where(eq(userTable.email, user.email?.toLowerCase().trim() || ""))
        .limit(1);

      if (finalUser) {
        await db.insert(loginActivityTable).values({
          userId: finalUser.id,
          ipAddress,
          userAgent,
          status: "success",
        });
      }

      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      // Run base configuration jwt callback first
      // @ts-ignore
      token = await authConfig.callbacks.jwt({ token, user, trigger, session });

      if (account?.provider === "google") {
        const email = token.email?.toLowerCase().trim();
        if (email) {
          const [dbUser] = await db
            .select()
            .from(userTable)
            .where(eq(userTable.email, email))
            .limit(1);

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role || "USER";
            token.isEmailVerified = !!dbUser.emailVerified;
            token.isOAuth = true;
          }
        }
      }
      return token;
    },
  },
});
