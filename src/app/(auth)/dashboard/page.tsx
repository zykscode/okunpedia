import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { Shield, Settings, BookOpen, User, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { auth } from '@/auth';
import { db } from '@/libs/DB';
import { userTable } from '@/models/Schema';
import { Badge } from '@/components/ui/Badge';
import { SignOutButton } from '@/components/SignOutButton';

export const metadata: Metadata = {
  title: 'My Dashboard — Okunpedia',
  description: 'Manage your contributor profile and access the admin portal.',
};

/** Maps a user role string to a readable label and badge variant. */
function roleLabel(role: string | null | undefined) {
  const cleanRole = role?.trim();
  switch (cleanRole) {
    case 'SUPER_ADMIN':
      return { label: 'Super Admin', variant: 'purple' as const };
    case 'ADMIN':
      return { label: 'Admin', variant: 'amber' as const };
    case 'USER':
      return { label: 'User', variant: 'neutral' as const };
    default:
      return { label: cleanRole || 'User', variant: 'neutral' as const };
  }
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, session.user.id))
    .limit(1);

  if (!user) {
    redirect('/sign-in');
  }

  const role = user.role;
  const isAdmin = role === 'SUPER_ADMIN' || role === 'ADMIN';
  const { label: roleText, variant: roleVariant } = roleLabel(role);

  const initials = (user.name ?? user.email ?? '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
      })
    : 'Unknown';

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-gray-900 to-emerald-950 p-8 text-white shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 text-2xl font-extrabold text-white shadow-lg ring-4 ring-white/10">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {user.name ?? 'Unnamed User'}
              </h1>
              <Badge variant={roleVariant}>{roleText}</Badge>
            </div>
            <p className="text-sm text-gray-400">{user.email}</p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Member since {memberSince}
              </span>
              {user.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {user.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <User className="size-3.5" />
                {user.status ?? 'Active'}
              </span>
            </div>
          </div>

          {/* Sign out */}
          <div className="shrink-0">
            <SignOutButton />
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="relative z-10 mt-6 border-t border-white/10 pt-4">
            <p className="text-sm leading-relaxed text-gray-300">{user.bio}</p>
          </div>
        )}
      </div>

      {/* Navigation Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Security Settings */}
        <Link
          href="/dashboard/security"
          className="group flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300/60 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-blue-700/40"
        >
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-600/10 transition-transform duration-200 group-hover:scale-105 dark:bg-blue-950/40 dark:text-blue-400">
            <Settings className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Security Settings</h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Update password, view login history
            </p>
          </div>
          <ChevronRight className="mt-auto size-4 text-gray-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-blue-500 dark:text-gray-700" />
        </Link>

        {/* Explore Communities */}
        <Link
          href="/communities"
          className="group flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300/60 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-emerald-700/40"
        >
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10 transition-transform duration-200 group-hover:scale-105 dark:bg-emerald-950/40 dark:text-emerald-400">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Explore Communities</h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Browse Okun heritage records
            </p>
          </div>
          <ChevronRight className="mt-auto size-4 text-gray-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-gray-700" />
        </Link>

        {/* Admin Portal — only for admins */}
        {isAdmin && (
          <Link
            href="/admin"
            className="group flex flex-col gap-3 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/60 hover:shadow-md dark:border-amber-900/40 dark:from-amber-950/20 dark:to-gray-900/60"
          >
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 ring-1 ring-amber-600/15 transition-transform duration-200 group-hover:scale-105 dark:bg-amber-950/40 dark:text-amber-400">
              <Shield className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Admin Portal</h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Manage communities, users & curation queue
              </p>
            </div>
            <ChevronRight className="mt-auto size-4 text-gray-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-amber-500 dark:text-gray-700" />
          </Link>
        )}
      </div>
    </div>
  );
}
