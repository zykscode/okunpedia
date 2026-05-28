import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { communitiesSchema } from '@/models/Schema';
import { SectionsEditor } from './SectionsEditor';

export default async function SectionsAdminPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const communityId = Number.parseInt(id, 10);
  if (Number.isNaN(communityId)) notFound();

  const [town] = await db
    .select({
      id: communitiesSchema.id,
      name: communitiesSchema.name,
      historicalBackground: communitiesSchema.historicalBackground,
      foundingStories: communitiesSchema.foundingStories,
      cultureAndTraditions: communitiesSchema.cultureAndTraditions,
    })
    .from(communitiesSchema)
    .where(eq(communitiesSchema.id, communityId))
    .limit(1);

  if (!town) notFound();

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
          historicalBackground: town?.historicalBackground ?? '',
          foundingStories: town?.foundingStories ?? '',
          cultureAndTraditions: town?.cultureAndTraditions ?? '',
        }}
      />
    </div>
  );
}
