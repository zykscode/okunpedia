import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { townTable, gisPolygonsSchema } from '@/models/Schema';
import { getOrCreateCommunity } from '../actions';
import { MapWrapper } from './MapWrapper';

export default async function MapAdminPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const [town] = await db
    .select({
      id: townTable.id,
      name: townTable.name,
      lat: townTable.lat,
      lng: townTable.lng,
    })
    .from(townTable)
    .where(eq(townTable.id, id))
    .limit(1);

  if (!town) notFound();

  const communityId = await getOrCreateCommunity(id);

  const [gisRecord] = await db
    .select()
    .from(gisPolygonsSchema)
    .where(eq(gisPolygonsSchema.communityId, communityId))
    .limit(1);

  // Default to Kogi / Okun area coordinates if town coordinates are empty
  const centerLat = town.lat ?? 7.820;
  const centerLng = town.lng ?? 6.240;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Geographic Boundary Editor</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Draw or edit the geographic polygon boundary of {town.name} on the map.
        </p>
      </div>

      <MapWrapper
        townId={id}
        centerLat={centerLat}
        centerLng={centerLng}
        initialFeatureCollection={gisRecord?.featureCollection as any ?? null}
      />
    </div>
  );
}
