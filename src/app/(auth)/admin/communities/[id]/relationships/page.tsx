import { notFound } from 'next/navigation';
import { eq, or } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { communitiesSchema, communityHierarchySchema, communityRelationshipsSchema } from '@/models/Schema';
import { RelationshipManager } from './RelationshipManager';

export default async function RelationshipsAdminPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const communityId = Number.parseInt(id, 10);
  if (Number.isNaN(communityId)) notFound();

  const [town] = await db
    .select({ id: communitiesSchema.id, name: communitiesSchema.name })
    .from(communitiesSchema)
    .where(eq(communitiesSchema.id, communityId))
    .limit(1);

  if (!town) notFound();

  // Fetch all communities to populate dropdown selection
  const allCommunities = await db
    .select({ id: communitiesSchema.id, name: communitiesSchema.name })
    .from(communitiesSchema)
    .orderBy(communitiesSchema.name);

  // Fetch hierarchy parent relationships
  const parents = await db
    .select({
      id: communityHierarchySchema.id,
      parentId: communityHierarchySchema.parentId,
      parentName: communitiesSchema.name,
      context: communityHierarchySchema.context,
      notes: communityHierarchySchema.notes,
    })
    .from(communityHierarchySchema)
    .leftJoin(communitiesSchema, eq(communityHierarchySchema.parentId, communitiesSchema.id))
    .where(eq(communityHierarchySchema.childId, communityId));

  // Fetch hierarchy child relationships
  const children = await db
    .select({
      id: communityHierarchySchema.id,
      childId: communityHierarchySchema.childId,
      childName: communitiesSchema.name,
      context: communityHierarchySchema.context,
      notes: communityHierarchySchema.notes,
    })
    .from(communityHierarchySchema)
    .leftJoin(communitiesSchema, eq(communityHierarchySchema.childId, communitiesSchema.id))
    .where(eq(communityHierarchySchema.parentId, communityId));

  // Fetch cross-community relationships (involving this community)
  const relationships = await db
    .select({
      id: communityRelationshipsSchema.id,
      sourceCommunityId: communityRelationshipsSchema.sourceCommunityId,
      targetCommunityId: communityRelationshipsSchema.targetCommunityId,
      relationshipType: communityRelationshipsSchema.relationshipType,
      description: communityRelationshipsSchema.description,
      establishedPeriod: communityRelationshipsSchema.establishedPeriod,
    })
    .from(communityRelationshipsSchema)
    .where(
      or(
        eq(communityRelationshipsSchema.sourceCommunityId, communityId),
        eq(communityRelationshipsSchema.targetCommunityId, communityId)
      )
    );

  const resolvedRelationships = relationships.map((rel) => {
    const isSource = rel.sourceCommunityId === communityId;
    const relatedId = isSource ? rel.targetCommunityId : rel.sourceCommunityId;
    const relatedName = allCommunities.find((c) => c.id === relatedId)?.name || 'Unknown Community';
    return {
      id: rel.id,
      relatedId,
      relatedName,
      relationshipType: rel.relationshipType,
      description: rel.description,
      establishedPeriod: rel.establishedPeriod,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Community Connections & Relations</h2>
        <p className="text-sm text-gray-550 dark:text-gray-450">
          Manage hierarchical relations (quarters, villages, clans) and horizontal connections (alliances, migrations) for {town.name}.
        </p>
      </div>

      <RelationshipManager
        townId={id}
        currentId={communityId}
        allCommunities={allCommunities}
        initialParents={parents}
        initialChildren={children}
        initialRelationships={resolvedRelationships}
      />
    </div>
  );
}
