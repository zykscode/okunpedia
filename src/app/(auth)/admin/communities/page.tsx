import type { Metadata } from 'next';
import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { PlusCircle, Pencil } from 'lucide-react';
import { db } from '@/libs/DB';
import { communitiesSchema, lgaTable } from '@/models/Schema';
import { Badge } from '@/components/ui/Badge';
import { CommunityActionsMenu } from './CommunityActionsMenu';

export const metadata: Metadata = {
  title: 'Manage Communities — Admin Portal',
  description: 'View, edit, publish and delete community entries.',
};

export default async function AdminCommunitiesPage() {
  const rawTowns = await db
    .select({
      id: communitiesSchema.id,
      name: communitiesSchema.name,
      slug: communitiesSchema.slug,
      tagline: communitiesSchema.tagline,
      status: communitiesSchema.status,
      lgaName: lgaTable.name,
      updatedAt: communitiesSchema.updatedAt,
    })
    .from(communitiesSchema)
    .leftJoin(lgaTable, eq(communitiesSchema.lgaId, lgaTable.id))
    .orderBy(desc(communitiesSchema.updatedAt));

  const towns = rawTowns.map(t => ({
    ...t,
    id: String(t.id),
    published: t.status === 'published',
  }));

  const total = towns.length;
  const published = towns.filter((t) => t.published).length;
  const drafts = total - published;

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
            <Link href="/admin" className="hover:text-emerald-600">Admin</Link>
            <span>/</span>
            <span>Communities</span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Community Management
          </h1>
        </div>
        <Link
          href="/admin/communities/new"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98]"
        >
          <PlusCircle className="size-4" />
          Add Community
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: total, color: 'text-gray-900 dark:text-white' },
          { label: 'Published', value: published, color: 'text-emerald-700 dark:text-emerald-400' },
          { label: 'Drafts', value: drafts, color: 'text-amber-700 dark:text-amber-400' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200/80 bg-white p-4 text-center shadow-xs dark:border-gray-800 dark:bg-gray-900/60"
          >
            <div className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</div>
            <div className="mt-0.5 text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Communities Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
        {towns.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No communities yet.{' '}
            <Link href="/admin/communities/new" className="font-semibold text-emerald-600 hover:underline">
              Add the first one →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {/* Header row */}
            <div className="hidden grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-6 py-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase dark:text-gray-600 sm:grid">
              <span>Community</span>
              <span>Status</span>
              <span>Updated</span>
              <span>Actions</span>
            </div>

            {towns.map((town) => (
              <div
                key={town.id}
                className="grid grid-cols-1 items-center gap-3 px-6 py-4 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30 sm:grid-cols-[1fr_auto_auto_auto]"
              >
                {/* Name + LGA */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-gray-900 dark:text-white">
                      {town.name}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {town.lgaName ?? 'Unknown LGA'}
                    {town.tagline ? ` · ${town.tagline}` : ''}
                  </p>
                </div>

                {/* Status Badge */}
                <Badge variant={town.published ? 'emerald' : 'amber'}>
                  {town.published ? 'Published' : 'Draft'}
                </Badge>

                {/* Date */}
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(town.updatedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/communities/${town.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                  >
                    <Pencil className="size-3" />
                    Edit
                  </Link>
                  <CommunityActionsMenu
                    townId={town.id}
                    published={town.published}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
