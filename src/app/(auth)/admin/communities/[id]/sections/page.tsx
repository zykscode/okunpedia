import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { townTable, communitiesSchema } from '@/models/Schema';
import { getOrCreateCommunity } from '../actions';
import { SectionsEditor } from './SectionsEditor';

export default async function SectionsAdminPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const [town] = await db
    .select({ id: townTable.id, name: townTable.name })
    .from(townTable)
    .where(eq(townTable.id, id))
    .limit(1);

  if (!town) notFound();

  const communityId = await getOrCreateCommunity(id);

  const [community] = await db
    .select({
      historicalBackground: communitiesSchema.historicalBackground,
      foundingStories: communitiesSchema.foundingStories,
      cultureAndTraditions: communitiesSchema.cultureAndTraditions,
    })
    .from(communitiesSchema)
    .where(eq(communitiesSchema.id, communityId))
    .limit(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cultural & Historical Sections</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Edit rich background sections including founding stories, culture, traditions, and general history.
        </p>
      </div>

      <SectionsEditor
        townId={id}
        initialData={{
          historicalBackground: community?.historicalBackground ?? '',
          foundingStories: community?.foundingStories ?? '',
          cultureAndTraditions: community?.cultureAndTraditions ?? '',
        }}
      />
    </div>
  );
}
