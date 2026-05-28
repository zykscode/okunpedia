import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { communitiesSchema, gisPolygonsSchema } from '@/models/Schema';
import { MapWrapper } from './MapWrapper';

export default async function MapAdminPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const communityId = Number.parseInt(id, 10);
  if (Number.isNaN(communityId)) notFound();

  const [town] = await db
    .select({
      id: communitiesSchema.id,
      name: communitiesSchema.name,
      lat: communitiesSchema.latitude,
      lng: communitiesSchema.longitude,
    })
    .from(communitiesSchema)
    .where(eq(communitiesSchema.id, communityId))
    .limit(1);

  if (!town) notFound();

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
