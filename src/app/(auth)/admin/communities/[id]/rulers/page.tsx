import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { townTable, traditionalRulersSchema } from '@/models/Schema';
import { getOrCreateCommunity } from '../actions';
import { RulerManager } from './RulerManager';

export default async function RulersAdminPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const [town] = await db
    .select({ id: townTable.id, name: townTable.name })
    .from(townTable)
    .where(eq(townTable.id, id))
    .limit(1);

  if (!town) notFound();

  const communityId = await getOrCreateCommunity(id);

  const rulers = await db
    .select()
    .from(traditionalRulersSchema)
    .where(eq(traditionalRulersSchema.communityId, communityId));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Traditional Leadership</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Document the chronological lineage of traditional rulers and the current incumbent of {town.name}.
        </p>
      </div>

      <RulerManager townId={id} initialRulers={rulers} />
    </div>
  );
}
