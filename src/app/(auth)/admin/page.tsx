import { eq, desc } from 'drizzle-orm';
import { auth } from '@/auth';
import { db } from '@/libs/DB';
import { Link } from '@/libs/I18nNavigation';
import { townTable, townRevisionsTable, userTable, lgaTable } from '@/models/Schema';
import { CurationList } from './CurationList';

export default async function AdminPage() {
  const session = await auth();
  const role = session?.user?.role;
  const isAdmin = role === 'SUPER_ADMIN' || role === 'ADMIN';

  // Fetch pending towns
  const pendingTowns = isAdmin
    ? await db
        .select({
          id: townTable.id,
          name: townTable.name,
          tagline: townTable.tagline,
          overview: townTable.overview,
          lgaName: lgaTable.name,
          createdAt: townTable.updatedAt,
        })
        .from(townTable)
        .leftJoin(lgaTable, eq(townTable.lgaId, lgaTable.id))
        .where(eq(townTable.published, false))
        .orderBy(desc(townTable.updatedAt))
    : [];

  // Fetch pending revisions
  const pendingRevisions = isAdmin
    ? await db
        .select({
          id: townRevisionsTable.id,
          townId: townRevisionsTable.townId,
          townName: townTable.name,
          originalName: townTable.name,
          originalTagline: townTable.tagline,
          originalOverview: townTable.overview,
          originalRulerTitle: townTable.rulerTitle,
          originalTraditionalRuler: townTable.traditionalRuler,
          name: townRevisionsTable.name,
          tagline: townRevisionsTable.tagline,
          overview: townRevisionsTable.overview,
          rulerTitle: townRevisionsTable.rulerTitle,
          traditionalRuler: townRevisionsTable.traditionalRuler,
          submittedBy: userTable.name,
          createdAt: townRevisionsTable.createdAt,
        })
        .from(townRevisionsTable)
        .leftJoin(townTable, eq(townRevisionsTable.townId, townTable.id))
        .leftJoin(userTable, eq(townRevisionsTable.submittedById, userTable.id))
        .where(eq(townRevisionsTable.status, 'pending'))
        .orderBy(desc(townRevisionsTable.createdAt))
    : [];

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

      {/* Module Shortcuts Section */}
      <div className="mx-auto max-w-2xl">
        {/* Upload Town / Community Entry Portal Card */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-xl sm:p-8">
          <div>
            <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-amber-50 p-3 text-amber-700 ring-1 ring-amber-600/10 transition-transform duration-300 group-hover:scale-110">
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Municipalities & Towns
            </h2>
            <p className="mt-2.5 text-xs leading-relaxed text-gray-600 sm:text-sm">
              Create and upload comprehensive encyclopedia records for Okun towns, including
              founding stories, lacking infrastructure, and traditional leadership hierarchies.
            </p>
          </div>

          <div className="mt-8 pt-2">
            <Link
              href="/admin/communities/new/"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-md transition-all hover:opacity-95 sm:text-sm"
            >
              <span>+ Add Community Monograph</span>
              <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
