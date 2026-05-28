import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { communitiesSchema, mediaTable } from '@/models/Schema';
import { MediaManager } from './MediaManager';

export default async function MediaAdminPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const communityId = Number.parseInt(id, 10);
  if (Number.isNaN(communityId)) notFound();

  const [town] = await db
    .select({ id: communitiesSchema.id, name: communitiesSchema.name })
    .from(communitiesSchema)
    .where(eq(communitiesSchema.id, communityId))
    .limit(1);

  if (!town) notFound();

  const mediaList = await db
    .select()
    .from(mediaTable)
    .where(eq(mediaTable.communityId, communityId));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Community Gallery</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload and manage images and media for {town.name}.
        </p>
      </div>

      <MediaManager townId={id} initialMedia={mediaList} />
    </div>
  );
}
