import { eq, desc, count } from 'drizzle-orm';
import Link from 'next/link';
import { auth } from '@/auth';
import { db } from '@/libs/DB';
import { communitiesSchema, communityRevisionsTable, userTable, lgaTable } from '@/models/Schema';
import { CurationList } from './CurationList';

export default async function AdminPage() {
  const session = await auth();
  const role = session?.user?.role;
  const isAdmin = role === 'SUPER_ADMIN' || role === 'ADMIN';
  const isSuperAdmin = role === 'SUPER_ADMIN';

  // Fetch pending towns
  const pendingTownsRaw = isAdmin
    ? await db
        .select({
          id: communitiesSchema.id,
          name: communitiesSchema.name,
          tagline: communitiesSchema.tagline,
          overview: communitiesSchema.overview,
          lgaName: lgaTable.name,
          createdAt: communitiesSchema.updatedAt,
        })
        .from(communitiesSchema)
        .leftJoin(lgaTable, eq(communitiesSchema.lgaId, lgaTable.id))
        .where(eq(communitiesSchema.status, 'draft'))
        .orderBy(desc(communitiesSchema.updatedAt))
    : [];

  const pendingTowns = pendingTownsRaw.map(t => ({
    ...t,
    id: String(t.id),
    overview: t.overview || '',
  }));

  // Fetch pending revisions
  const pendingRevisionsRaw = isAdmin
    ? await db
        .select({
          id: communityRevisionsTable.id,
          townId: communityRevisionsTable.communityId,
          townName: communitiesSchema.name,
          originalName: communitiesSchema.name,
          originalTagline: communitiesSchema.tagline,
          originalOverview: communitiesSchema.overview,
          originalHistoricalBackground: communitiesSchema.historicalBackground,
          originalFoundingStories: communitiesSchema.foundingStories,
          originalCultureAndTraditions: communitiesSchema.cultureAndTraditions,
          name: communityRevisionsTable.name,
          tagline: communityRevisionsTable.tagline,
          overview: communityRevisionsTable.overview,
          historicalBackground: communityRevisionsTable.historicalBackground,
          foundingStories: communityRevisionsTable.foundingStories,
          cultureAndTraditions: communityRevisionsTable.cultureAndTraditions,
          submittedBy: userTable.name,
          createdAt: communityRevisionsTable.createdAt,
        })
        .from(communityRevisionsTable)
        .leftJoin(communitiesSchema, eq(communityRevisionsTable.communityId, communitiesSchema.id))
        .leftJoin(userTable, eq(communityRevisionsTable.submittedById, userTable.id))
        .where(eq(communityRevisionsTable.status, 'pending'))
        .orderBy(desc(communityRevisionsTable.createdAt))
    : [];

  const pendingRevisions = pendingRevisionsRaw.map(r => ({
    ...r,
    townId: String(r.townId),
    overview: r.overview || '',
    originalOverview: r.originalOverview || '',
  }));

  // Counts for portal cards
  const communityCountResult = await db
    .select({ value: count() })
    .from(communitiesSchema);
  const communityCount = communityCountResult[0]?.value ?? 0;

  const userCountResult = isAdmin
    ? await db.select({ value: count() }).from(userTable)
    : [];
  const userCount = userCountResult[0]?.value ?? 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-4 sm:py-8">
      {/* Official Curation Hub Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-gray-900 to-emerald-950 p-8 text-white shadow-2xl sm:p-12">
        {/* Soft atmospheric backglow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-gray-800/80 pb-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-400 uppercase ring-1 ring-emerald-500/20">
            <span>🛡️ Protected Archival Workspace</span>
          </div>
          <span className="text-xs font-medium text-gray-400">
            Authenticated Contributor Session ({role})
          </span>
        </div>

        <div className="relative z-10 mt-6">
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Okunpedia Curation Center
          </h1>
          <p className="mt-2 max-w-2xl text-xs text-gray-300 sm:text-base">
            Select a designated administrative node below to draft or sync regional monographs and
            localized municipal records.
          </p>
        </div>
      </div>

      {/* Admin Verification Desk Queue (Admins only) */}
      {isAdmin && (
        <div className="border-gray-250/20 space-y-4 rounded-3xl border bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            🛡️ Administrative Curation Queue
          </h2>
          <p className="text-sm text-gray-500">
            Review community uploads and proposed edits submitted by the contributor community.
          </p>
          <CurationList pendingTowns={pendingTowns} pendingRevisions={pendingRevisions} />
        </div>
      )}

      {/* Portal Navigation Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Add Community */}
        <Link
          href="/admin/communities/new"
          className="group flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300/60 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60"
        >
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-600/10 transition-transform group-hover:scale-105 dark:bg-amber-950/40 dark:text-amber-400">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Add Community</h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Create a new community entry</p>
          </div>
        </Link>

        {/* Manage Communities */}
        <Link
          href="/admin/communities"
          className="group flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300/60 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60"
        >
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10 transition-transform group-hover:scale-105 dark:bg-emerald-950/40 dark:text-emerald-400">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Communities</h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{communityCount} total entries</p>
          </div>
        </Link>

        {/* User Management — super-admin only */}
        {isSuperAdmin && (
          <Link
            href="/admin/users"
            className="group flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-300/60 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60"
          >
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 ring-1 ring-purple-600/10 transition-transform group-hover:scale-105 dark:bg-purple-950/40 dark:text-purple-400">
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Users</h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{userCount} registered members</p>
            </div>
          </Link>
        )}

        {/* Tracker — todos & issues */}
        <Link
          href="/admin/tracker"
          className="group flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300/60 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60"
        >
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10 transition-transform group-hover:scale-105 dark:bg-indigo-950/40 dark:text-indigo-400">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Tracker</h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Todos &amp; app issues</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

