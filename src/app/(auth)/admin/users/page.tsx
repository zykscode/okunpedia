import type { Metadata } from 'next';
import Link from 'next/link';
import { desc } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { userTable } from '@/models/Schema';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { UserRoleToggle } from './UserRoleToggle';

export const metadata: Metadata = {
  title: 'User Management — Admin Portal',
};

/** Maps role string to badge variant. */
function roleBadgeVariant(role: string | null) {
  switch (role) {
    case 'SUPER_ADMIN': return 'purple' as const;
    case 'ADMIN': return 'amber' as const;
    default: return 'neutral' as const;
  }
}

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const isSuperAdmin = session.user.role === 'SUPER_ADMIN';

  const users = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      role: userTable.role,
      status: userTable.status,
      createdAt: userTable.createdAt,
    })
    .from(userTable)
    .orderBy(desc(userTable.createdAt));

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
          <Link href="/admin" className="hover:text-emerald-600">Admin</Link>
          <span>/</span>
          <span>Users</span>
        </div>
        <h1 className="mt-1 font-serif text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          User Management
        </h1>
        {!isSuperAdmin && (
          <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400">
            Role promotion is restricted to Super Admins. You can view the user list but cannot change roles.
          </p>
        )}
      </div>

      {/* User Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
        <div className="hidden grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-6 py-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase dark:text-gray-600 sm:grid">
          <span>User</span>
          <span>Status</span>
          <span>Role</span>
          {isSuperAdmin && <span>Change Role</span>}
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {users.map((user) => {
            const initials = (user.name ?? user.email ?? '?')
              .split(' ')
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase() ?? '')
              .join('');
            const isCurrentUser = user.id === session.user.id;

            return (
              <div
                key={user.id}
                className="grid grid-cols-1 items-center gap-3 px-6 py-4 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30 sm:grid-cols-[1fr_auto_auto_auto]"
              >
                {/* Avatar + info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-amber-400 text-xs font-bold text-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {user.name ?? 'Unnamed'}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">(you)</span>
                      )}
                    </div>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>

                {/* Status */}
                <Badge variant={user.status === 'BLOCKED' ? 'danger' : 'success'}>
                  {user.status ?? 'Active'}
                </Badge>

                {/* Role */}
                <Badge variant={roleBadgeVariant(user.role)}>
                  {user.role ?? 'USER'}
                </Badge>

                {/* Role toggle (super-admin only, not self) */}
                {isSuperAdmin && (
                  <div>
                    {isCurrentUser ? (
                      <span className="text-xs text-gray-400 dark:text-gray-600">—</span>
                    ) : (
                      <UserRoleToggle
                        userId={user.id}
                        currentRole={user.role ?? 'USER'}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
