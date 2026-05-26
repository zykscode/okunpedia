import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { townTable, amenitiesSchema } from '@/models/Schema';
import { getOrCreateCommunity } from '../actions';
import { AmenityManager } from './AmenityManager';

export default async function AmenitiesAdminPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const [town] = await db
    .select({ id: townTable.id, name: townTable.name })
    .from(townTable)
    .where(eq(townTable.id, id))
    .limit(1);

  if (!town) notFound();

  const communityId = await getOrCreateCommunity(id);

  const amenities = await db
    .select()
    .from(amenitiesSchema)
    .where(eq(amenitiesSchema.communityId, communityId));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Community Infrastructure & Amenities</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Track educational, healthcare, transport, water, and power facilities in {town.name} and their functional state.
        </p>
      </div>

      <AmenityManager townId={id} initialAmenities={amenities} />
    </div>
  );
}
