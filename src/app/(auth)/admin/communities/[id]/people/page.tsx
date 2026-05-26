import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { townTable, prominentIndigenesSchema } from '@/models/Schema';
import { getOrCreateCommunity } from '../actions';
import { IndigeneManager } from './IndigeneManager';

export default async function PeopleAdminPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const [town] = await db
    .select({ id: townTable.id, name: townTable.name })
    .from(townTable)
    .where(eq(townTable.id, id))
    .limit(1);

  if (!town) notFound();

  const communityId = await getOrCreateCommunity(id);

  const indigenes = await db
    .select()
    .from(prominentIndigenesSchema)
    .where(eq(prominentIndigenesSchema.communityId, communityId));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Prominent Indigenes</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Document distinguished sons and daughters of {town.name} who have made significant contributions.
        </p>
      </div>

      <IndigeneManager townId={id} initialIndigenes={indigenes} />
    </div>
  );
}
