import { notFound } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { db } from '@/libs/DB';
import { communitiesSchema, lgaTable, prominentIndigenesSchema, communityRevisionsTable } from '@/models/Schema';

export default async function CommunityOverviewPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const communityId = Number.parseInt(id, 10);
  if (Number.isNaN(communityId)) notFound();

  const [town] = await db
    .select({
      id: communitiesSchema.id,
      name: communitiesSchema.name,
      slug: communitiesSchema.slug,
      tagline: communitiesSchema.tagline,
      overview: communitiesSchema.overview,
      updatedAt: communitiesSchema.updatedAt,
      lgaName: lgaTable.name,
    })
    .from(communitiesSchema)
    .leftJoin(lgaTable, eq(communitiesSchema.lgaId, lgaTable.id))
    .where(eq(communitiesSchema.id, communityId))
    .limit(1);

  if (!town) notFound();

  const [indigeneCount, pendingRevisions] = await Promise.all([
    db.select().from(prominentIndigenesSchema).where(eq(prominentIndigenesSchema.communityId, communityId)),
    db.select().from(communityRevisionsTable)
      .where(eq(communityRevisionsTable.communityId, communityId))
      .orderBy(desc(communityRevisionsTable.createdAt))
      .limit(5),
  ]);

  const stats = [
    { label: 'Prominent Indigenes', value: indigeneCount.length, href: 'people' },
    { label: 'Pending Revisions', value: pendingRevisions.filter(r => r.status === 'pending').length, href: 'edit' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={`/admin/communities/${id}/${s.href}`}
            className="group rounded-2xl border border-gray-200/80 bg-white p-4 text-center shadow-xs transition-all hover:-translate-y-0.5 hover:border-emerald-300/50 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60"
          >
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{s.value}</div>
            <div className="mt-0.5 text-xs text-gray-500">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">LGA</p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-white">{town.lgaName ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">Slug</p>
            <p className="mt-1 font-mono text-sm text-gray-700 dark:text-gray-300">{town.slug}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">Last updated</p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              {new Date(town.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {town.overview && (
          <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-800">
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2">Overview</p>
            <p className="text-sm leading-relaxed text-gray-700 line-clamp-6 dark:text-gray-300">{town.overview}</p>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/admin/communities/${id}/edit`}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-[0.98]"
        >
          Edit Community
        </Link>
        <Link
          href={`/communities/${town.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          View Public Page ↗
        </Link>
      </div>
    </div>
  );
}
