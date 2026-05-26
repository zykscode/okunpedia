'use server';

import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { db } from '@/libs/DB';
import { requireRole } from '@/libs/auth/guards';
import {
  communitiesSchema,
  townTable,
  lgaTable,
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
async function logAction(actorId: string, action: string, targetType: 'indigene' | 'ruler' | 'amenity' | 'community' | 'media', targetId: string, details?: object) {

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

/** Resolves or creates a community mapping record for the Town. */
export async function getOrCreateCommunity(townId: string): Promise<number> {
  const [town] = await db
    .select({
      name: townTable.name,
      slug: townTable.slug,
      tagline: townTable.tagline,
      overview: townTable.overview,
      lgaName: lgaTable.name,
    })
    .from(townTable)
    .leftJoin(lgaTable, eq(townTable.lgaId, lgaTable.id))
    .where(eq(townTable.id, townId))
    .limit(1);

  if (!town) {
    throw new Error('Town not found');
  }

  const [existing] = await db
    .select({ id: communitiesSchema.id })
    .from(communitiesSchema)
    .where(eq(communitiesSchema.slug, town.slug))
    .limit(1);

  if (existing) {
    return existing.id;
  }

  const [inserted] = await db
    .insert(communitiesSchema)
    .values({
      name: town.name,
      slug: town.slug,
      lga: town.lgaName ?? 'Unknown',
      districtOrClan: town.tagline ?? 'Unknown',
      historicalBackground: town.overview,
      createdBy: 'system',
    })
    .returning({ id: communitiesSchema.id });

  if (!inserted) {
    throw new Error('Failed to create community mapping');
  }

  return inserted.id;
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


