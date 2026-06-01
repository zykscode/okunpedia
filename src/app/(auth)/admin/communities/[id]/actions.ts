'use server';

import { eq, and } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { db } from '@/libs/DB';
import { requireRole } from '@/libs/auth/guards';
import {
  communitiesSchema,
  communityHierarchySchema,
  communityRelationshipsSchema,
  prominentIndigenesSchema,
  traditionalRulersSchema,
  amenitiesSchema,
  gisPolygonsSchema,
  auditLogsTable,
  mediaTable,
} from '@/models/Schema';

export type ActionState = {
  success: boolean;
  message: string;
};

/** Logs an administrative action. */
async function logAction(
  actorId: string,
  action: string,
  targetType: 'indigene' | 'ruler' | 'amenity' | 'community' | 'media',
  targetId: string,
  details?: object,
) {
  try {
    await db.insert(auditLogsTable).values({
      actorId,
      action,
      targetType,
      targetId,
      after: details ? details : null,
    });
  } catch {
    // Ignore log failures
  }
}

/** Resolves the community ID from the string parameter. */
export async function getOrCreateCommunity(townId: string): Promise<number> {
  const id = Number.parseInt(townId, 10);
  if (Number.isNaN(id)) {
    throw new Error('Invalid community ID');
  }
  return id;
}

// ---------------------------------------------------------------
// PROMINENT INDIGENES ACTIONS
// ---------------------------------------------------------------

const IndigeneSchema = z.object({
  name: z.string().min(2).max(100),
  biography: z.string().min(10),
});

export async function addIndigeneAction(
  townId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const parsed = IndigeneSchema.safeParse({
      name: formData.get('name'),
      biography: formData.get('biography'),
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid inputs.' };
    }

    const communityId = await getOrCreateCommunity(townId);

    const [inserted] = await db.insert(prominentIndigenesSchema).values({
      communityId,
      name: parsed.data.name,
      biography: parsed.data.biography,
      achievements: [],
    }).returning({ id: prominentIndigenesSchema.id });

    if (inserted) {
      await logAction(session.user.id, 'add_indigene', 'indigene', String(inserted.id), { name: parsed.data.name });
    }

    revalidateTag(`community-${townId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Indigene added successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to add indigene.' };
  }
}

export async function deleteIndigeneAction(townId: string, indigeneId: number): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');

    await db.delete(prominentIndigenesSchema).where(eq(prominentIndigenesSchema.id, indigeneId));
    await logAction(session.user.id, 'delete_indigene', 'indigene', String(indigeneId));

    revalidateTag(`community-${townId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Indigene removed successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete indigene.' };
  }
}

export async function updateIndigeneAction(
  townId: string,
  indigeneId: number,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const parsed = IndigeneSchema.safeParse({
      name: formData.get('name'),
      biography: formData.get('biography'),
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid inputs.' };
    }

    const communityId = await getOrCreateCommunity(townId);

    await db
      .update(prominentIndigenesSchema)
      .set({
        name: parsed.data.name,
        biography: parsed.data.biography,
      })
      .where(and(eq(prominentIndigenesSchema.id, indigeneId), eq(prominentIndigenesSchema.communityId, communityId)));

    await logAction(session.user.id, 'update_indigene', 'indigene', String(indigeneId), { name: parsed.data.name });

    revalidateTag(`community-${townId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Indigene updated successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update indigene.' };
  }
}


// ---------------------------------------------------------------
// TRADITIONAL RULERS ACTIONS
// ---------------------------------------------------------------

const RulerSchema = z.object({
  title: z.string().min(2).max(100),
  name: z.string().min(2).max(200),
  reignStart: z.string().optional(),
  reignEnd: z.string().optional(),
  isIncumbent: z.enum(['true', 'false']).transform((v) => v === 'true'),
});

export async function addRulerAction(
  townId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const parsed = RulerSchema.safeParse({
      title: formData.get('title'),
      name: formData.get('name'),
      reignStart: formData.get('reignStart') || undefined,
      reignEnd: formData.get('reignEnd') || undefined,
      isIncumbent: formData.get('isIncumbent') ?? 'false',
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid inputs.' };
    }

    const communityId = await getOrCreateCommunity(townId);

    const [inserted] = await db.insert(traditionalRulersSchema).values({
      communityId,
      title: parsed.data.title,
      name: parsed.data.name,
      reignStart: parsed.data.reignStart || null,
      reignEnd: parsed.data.reignEnd || null,
      isIncumbent: parsed.data.isIncumbent,
    }).returning({ id: traditionalRulersSchema.id });

    if (inserted) {
      await logAction(session.user.id, 'add_ruler', 'ruler', String(inserted.id), { name: parsed.data.name });
    }

    revalidateTag(`community-${townId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Traditional ruler added successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to add traditional ruler.' };
  }
}

export async function deleteRulerAction(townId: string, rulerId: number): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');

    await db.delete(traditionalRulersSchema).where(eq(traditionalRulersSchema.id, rulerId));
    await logAction(session.user.id, 'delete_ruler', 'ruler', String(rulerId));

    revalidateTag(`community-${townId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Traditional ruler removed successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete traditional ruler.' };
  }
}

export async function updateRulerAction(
  townId: string,
  rulerId: number,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const parsed = RulerSchema.safeParse({
      title: formData.get('title'),
      name: formData.get('name'),
      reignStart: formData.get('reignStart') || undefined,
      reignEnd: formData.get('reignEnd') || undefined,
      isIncumbent: formData.get('isIncumbent') ?? 'false',
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid inputs.' };
    }

    const communityId = await getOrCreateCommunity(townId);

    await db
      .update(traditionalRulersSchema)
      .set({
        title: parsed.data.title,
        name: parsed.data.name,
        reignStart: parsed.data.reignStart || null,
        reignEnd: parsed.data.reignEnd || null,
        isIncumbent: parsed.data.isIncumbent,
      })
      .where(and(eq(traditionalRulersSchema.id, rulerId), eq(traditionalRulersSchema.communityId, communityId)));

    await logAction(session.user.id, 'update_ruler', 'ruler', String(rulerId), { name: parsed.data.name });

    revalidateTag(`community-${townId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Traditional ruler updated successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update traditional ruler.' };
  }
}


// ---------------------------------------------------------------
// AMENITIES ACTIONS
// ---------------------------------------------------------------

const AmenitySchema = z.object({
  category: z.string().min(2),
  name: z.string().min(2),
  status: z.string().min(2),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export async function addAmenityAction(
  townId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const parsed = AmenitySchema.safeParse({
      category: formData.get('category'),
      name: formData.get('name'),
      status: formData.get('status'),
      latitude: formData.get('latitude') || undefined,
      longitude: formData.get('longitude') || undefined,
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid inputs.' };
    }

    const communityId = await getOrCreateCommunity(townId);

    const [inserted] = await db.insert(amenitiesSchema).values({
      communityId,
      category: parsed.data.category,
      name: parsed.data.name,
      status: parsed.data.status,
      latitude: parsed.data.latitude ?? null,
      longitude: parsed.data.longitude ?? null,
    }).returning({ id: amenitiesSchema.id });

    if (inserted) {
      await logAction(session.user.id, 'add_amenity', 'amenity', String(inserted.id), { name: parsed.data.name });
    }

    revalidateTag(`community-${townId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Amenity added successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to add amenity.' };
  }
}

export async function deleteAmenityAction(townId: string, amenityId: number): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');

    await db.delete(amenitiesSchema).where(eq(amenitiesSchema.id, amenityId));
    await logAction(session.user.id, 'delete_amenity', 'amenity', String(amenityId));

    revalidateTag(`community-${townId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Amenity removed successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete amenity.' };
  }
}

export async function updateAmenityAction(
  townId: string,
  amenityId: number,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const parsed = AmenitySchema.safeParse({
      category: formData.get('category'),
      name: formData.get('name'),
      status: formData.get('status'),
      latitude: formData.get('latitude') || undefined,
      longitude: formData.get('longitude') || undefined,
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid inputs.' };
    }

    const communityId = await getOrCreateCommunity(townId);

    await db
      .update(amenitiesSchema)
      .set({
        category: parsed.data.category,
        name: parsed.data.name,
        status: parsed.data.status,
        latitude: parsed.data.latitude ?? null,
        longitude: parsed.data.longitude ?? null,
      })
      .where(and(eq(amenitiesSchema.id, amenityId), eq(amenitiesSchema.communityId, communityId)));

    await logAction(session.user.id, 'update_amenity', 'amenity', String(amenityId), { name: parsed.data.name });

    revalidateTag(`community-${townId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Amenity updated successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update amenity.' };
  }
}


// ---------------------------------------------------------------
// GIS MAP ACTIONS
// ---------------------------------------------------------------

export async function saveGisPolygonAction(
  townId: string,
  featureCollection: object,
  centerLat?: number,
  centerLng?: number,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const communityId = await getOrCreateCommunity(townId);

    // Upsert GIS record
    const [existing] = await db
      .select({ id: gisPolygonsSchema.id })
      .from(gisPolygonsSchema)
      .where(eq(gisPolygonsSchema.communityId, communityId))
      .limit(1);

    if (existing) {
      await db
        .update(gisPolygonsSchema)
        .set({
          featureCollection,
          centerLatitude: centerLat ?? null,
          centerLongitude: centerLng ?? null,
          updatedAt: new Date(),
        })
        .where(eq(gisPolygonsSchema.id, existing.id));
    } else {
      await db.insert(gisPolygonsSchema).values({
        communityId,
        featureCollection,
        centerLatitude: centerLat ?? null,
        centerLongitude: centerLng ?? null,
      });
    }

    await logAction(session.user.id, 'save_gis', 'community', String(communityId));

    revalidateTag(`community-${townId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'GIS polygon boundary saved successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to save GIS boundary.' };
  }
}

export async function deleteMediaAction(townId: string, mediaId: string): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    await db.delete(mediaTable).where(eq(mediaTable.id, mediaId));
    await logAction(session.user.id, 'delete_media', 'media', mediaId);
    revalidateTag(`community-${townId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Media removed successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete media.' };
  }
}

const SectionsSchema = z.object({
  historicalBackground: z.string().optional(),
  foundingStories: z.string().optional(),
  cultureAndTraditions: z.string().optional(),
});

export async function updateCommunitySectionsAction(
  townId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const parsed = SectionsSchema.safeParse({
      historicalBackground: formData.get('historicalBackground') || '',
      foundingStories: formData.get('foundingStories') || '',
      cultureAndTraditions: formData.get('cultureAndTraditions') || '',
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid inputs.' };
    }

    const communityId = await getOrCreateCommunity(townId);

    await db
      .update(communitiesSchema)
      .set({
        historicalBackground: parsed.data.historicalBackground || null,
        foundingStories: parsed.data.foundingStories || null,
        cultureAndTraditions: parsed.data.cultureAndTraditions || null,
      })
      .where(eq(communitiesSchema.id, communityId));

    await logAction(session.user.id, 'update_sections', 'community', String(communityId));

    revalidateTag(`community-${townId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Sections updated successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update sections.' };
  }
}

const HierarchySchema = z.object({
  relationType: z.enum(['child', 'parent']),
  targetCommunityId: z.coerce.number(),
  context: z.string().min(1),
  notes: z.string().optional(),
});

export async function addHierarchyAction(
  townId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const parsed = HierarchySchema.safeParse({
      relationType: formData.get('relationType'),
      targetCommunityId: formData.get('targetCommunityId'),
      context: formData.get('context'),
      notes: formData.get('notes') || '',
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid inputs.' };
    }

    const currentId = await getOrCreateCommunity(townId);
    const targetId = parsed.data.targetCommunityId;

    if (currentId === targetId) {
      return { success: false, message: 'A community cannot be related to itself.' };
    }

    const parentId = parsed.data.relationType === 'child' ? currentId : targetId;
    const childId = parsed.data.relationType === 'child' ? targetId : currentId;

    // Check if duplicate exists
    const existing = await db
      .select()
      .from(communityHierarchySchema)
      .where(
        and(
          eq(communityHierarchySchema.parentId, parentId),
          eq(communityHierarchySchema.childId, childId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return { success: false, message: 'This hierarchical connection already exists.' };
    }

    const [inserted] = await db.insert(communityHierarchySchema).values({
      parentId,
      childId,
      context: parsed.data.context,
      notes: parsed.data.notes || null,
    }).returning({ id: communityHierarchySchema.id });

    if (inserted) {
      await db
        .update(communitiesSchema)
        .set({ parentCommunityId: parentId })
        .where(eq(communitiesSchema.id, childId));

      await logAction(session.user.id, 'add_hierarchy', 'community', String(currentId), { hierarchyId: inserted.id });
    }

    revalidateTag(`community-${currentId}`, 'max');
    revalidateTag(`community-${targetId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Hierarchical connection added.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to add hierarchical connection.' };
  }
}

export async function deleteHierarchyAction(
  townId: string,
  hierarchyId: number,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const currentId = await getOrCreateCommunity(townId);

    const [hierarchy] = await db
      .select({ parentId: communityHierarchySchema.parentId, childId: communityHierarchySchema.childId })
      .from(communityHierarchySchema)
      .where(eq(communityHierarchySchema.id, hierarchyId))
      .limit(1);

    if (!hierarchy) {
      return { success: false, message: 'Hierarchical connection not found.' };
    }

    await db
      .delete(communityHierarchySchema)
      .where(eq(communityHierarchySchema.id, hierarchyId));

    // Reset parentCommunityId on the child if it points to this parent
    await db
      .update(communitiesSchema)
      .set({ parentCommunityId: null })
      .where(
        and(
          eq(communitiesSchema.id, hierarchy.childId),
          eq(communitiesSchema.parentCommunityId, hierarchy.parentId)
        )
      );

    const otherId = hierarchy.parentId === currentId ? hierarchy.childId : hierarchy.parentId;

    await logAction(session.user.id, 'delete_hierarchy', 'community', String(currentId), { hierarchyId });

    revalidateTag(`community-${currentId}`, 'max');
    revalidateTag(`community-${otherId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Hierarchical connection removed.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete hierarchical connection.' };
  }
}

const RelationshipSchema = z.object({
  targetCommunityId: z.coerce.number(),
  relationshipType: z.string().min(1),
  description: z.string().optional(),
  establishedPeriod: z.string().optional(),
});

export async function addRelationshipAction(
  townId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const parsed = RelationshipSchema.safeParse({
      targetCommunityId: formData.get('targetCommunityId'),
      relationshipType: formData.get('relationshipType'),
      description: formData.get('description') || '',
      establishedPeriod: formData.get('establishedPeriod') || '',
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid inputs.' };
    }

    const currentId = await getOrCreateCommunity(townId);
    const targetId = parsed.data.targetCommunityId;

    if (currentId === targetId) {
      return { success: false, message: 'A community cannot form a relationship with itself.' };
    }

    // Check if duplicate exists (either direction for relationships)
    const existing = await db
      .select()
      .from(communityRelationshipsSchema)
      .where(
        and(
          eq(communityRelationshipsSchema.sourceCommunityId, currentId),
          eq(communityRelationshipsSchema.targetCommunityId, targetId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return { success: false, message: 'This relationship connection already exists.' };
    }

    const [inserted] = await db.insert(communityRelationshipsSchema).values({
      sourceCommunityId: currentId,
      targetCommunityId: targetId,
      relationshipType: parsed.data.relationshipType,
      description: parsed.data.description || null,
      establishedPeriod: parsed.data.establishedPeriod || null,
    }).returning({ id: communityRelationshipsSchema.id });

    if (inserted) {
      await logAction(session.user.id, 'add_relationship', 'community', String(currentId), { relationshipId: inserted.id });
    }

    revalidateTag(`community-${townId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Relationship added successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to add relationship.' };
  }
}

export async function deleteRelationshipAction(
  townId: string,
  relationshipId: number,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const currentId = await getOrCreateCommunity(townId);

    await db
      .delete(communityRelationshipsSchema)
      .where(eq(communityRelationshipsSchema.id, relationshipId));

    await logAction(session.user.id, 'delete_relationship', 'community', String(currentId), { relationshipId });

    revalidateTag(`community-${townId}`, 'max');
    revalidateTag('communities', 'max');
    return { success: true, message: 'Relationship connection removed.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete relationship connection.' };
  }
}
