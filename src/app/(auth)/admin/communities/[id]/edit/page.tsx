import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { townTable, lgaTable } from '@/models/Schema';
import { EditTownForm } from './EditTownForm';

export const metadata: Metadata = {
  title: 'Edit Community — Admin Portal',
};

export default async function EditCommunityPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const [town] = await db
    .select({
      id: townTable.id,
      name: townTable.name,
      tagline: townTable.tagline,
      overview: townTable.overview,
      rulerTitle: townTable.rulerTitle,
      traditionalRuler: townTable.traditionalRuler,
      published: townTable.published,
      lgaName: lgaTable.name,
    })
    .from(townTable)
    .leftJoin(lgaTable, eq(townTable.lgaId, lgaTable.id))
    .where(eq(townTable.id, id))
    .limit(1);

  if (!town) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
          <Link href="/admin" className="hover:text-emerald-600">Admin</Link>
          <span>/</span>
          <Link href="/admin/communities" className="hover:text-emerald-600">Communities</Link>
          <span>/</span>
          <span>Edit</span>
        </div>
        <h1 className="mt-2 font-serif text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Edit: {town.name}
        </h1>
        {town.lgaName && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {town.lgaName} LGA
          </p>
        )}
      </div>

      {/* Form */}
      <EditTownForm town={town} />
    </div>
  );
}
