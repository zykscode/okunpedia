import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { communitiesSchema, traditionalRulersSchema } from '@/models/Schema';
import { RulerManager } from './RulerManager';

export default async function RulersAdminPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const communityId = Number.parseInt(id, 10);
  if (Number.isNaN(communityId)) notFound();

  const [town] = await db
    .select({ id: communitiesSchema.id, name: communitiesSchema.name })
    .from(communitiesSchema)
    .where(eq(communitiesSchema.id, communityId))
    .limit(1);

  if (!town) notFound();

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
