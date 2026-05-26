import { redirect } from 'next/navigation';
import { auth } from '@/auth';

const ROLE_RANK = {
  USER: 0,
  MODERATOR: 1,
  EDITOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
} as const;

export type UserRole = keyof typeof ROLE_RANK;

export type AuthedSession = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role: string;
  };
};

/**
 * Asserts the current session has at least `minRole`.
 * Redirects to `redirectTo` if unauthenticated or insufficiently privileged.
 * Returns the validated session on success.
 */
export async function requireRole(
  minRole: UserRole,
  redirectTo = '/dashboard',
): Promise<AuthedSession> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const role = (session.user.role ?? 'USER') as UserRole;
  const rank = ROLE_RANK[role] ?? 0;
  const minRank = ROLE_RANK[minRole];

  if (rank < minRank) {
    redirect(redirectTo);
  }

  return session as AuthedSession;
}

/** Returns true if the role meets the minimum threshold (non-redirecting check). */
export function hasRole(role: string | null | undefined, minRole: UserRole): boolean {
  const userRole = (role ?? 'USER') as UserRole;
  const rank = ROLE_RANK[userRole] ?? 0;
  const minRank = ROLE_RANK[minRole];
  return rank >= minRank;
}

