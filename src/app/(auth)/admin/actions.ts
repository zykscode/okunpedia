// oxlint-disable unicorn/prefer-string-replace-all
// oxlint-disable require-unicode-regexp
'use server';

import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/libs/DB';
import { requireRole } from '@/libs/auth/guards';
import {
  lgaTable,
  userTable,
  auditLogsTable,
  communitiesSchema,
  communityRevisionsTable,
} from '@/models/Schema';

export type ActionState = {
  success: boolean;
  message: string;
};

/** Generates a URL-safe slug from a string. */
const generateSlug = (input: string) =>
  input
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

/** Inserts a row into the audit log (fire-and-forget, non-throwing). */
async function insertAuditLog(opts: {
  actorId: string;
  action: string;
  targetType: 'community' | 'revision' | 'user' | 'media' | 'indigene' | 'ruler' | 'amenity';
  targetId: string;
  before?: object;
  after?: object;
}) {
  try {
    await db.insert(auditLogsTable).values({
      actorId: opts.actorId,
      action: opts.action,
      targetType: opts.targetType,
      targetId: opts.targetId,
      before: opts.before ?? null,
      after: opts.after ?? null,
    });
  } catch {
    // Audit log failure must never break the primary action
  }
}

// ---------------------------------------------------------------
// SCHEMAS
// ---------------------------------------------------------------

const CreateCommunitySchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters').max(200),
  lga:     z.string().min(1, 'LGA is required'),
  tagline: z.string().max(300).optional(),
  overview: z.string().max(20_000).optional(),
});

const UpdateTownSchema = z.object({
  name:              z.string().min(2).max(200),
  lga:               z.string().min(1, 'LGA is required'),
  tagline:           z.string().max(300).optional(),
  overview:          z.string().min(10, 'Overview must be at least 10 characters').max(20_000),
  published:         z.enum(['true', 'false']).transform((v) => v === 'true'),
});

const UpdateUserRoleSchema = z.object({
  targetUserId: z.string().min(1),
  newRole:      z.enum(['USER', 'ADMIN']),
});

// ---------------------------------------------------------------
// COMMUNITY CREATE
// ---------------------------------------------------------------

export async function createCommunityAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');

    const parsed = CreateCommunitySchema.safeParse({
      name:     formData.get('name'),
      lga:      formData.get('lga'),
      tagline:  formData.get('districtOrClan'),
      overview: formData.get('historicalBackground'),
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? 'Validation failed.' };
    }

    const { name, lga: lgaName, tagline, overview } = parsed.data;

    const lgaRows = await db
      .select({ id: lgaTable.id })
      .from(lgaTable)
      .where(eq(lgaTable.name, lgaName))
      .limit(1);

    if (!lgaRows[0]) {
      return { success: false, message: `LGA "${lgaName}" not found.` };
    }

    const slug = generateSlug(name);

    const [inserted] = await db.insert(communitiesSchema).values({
      name,
      slug,
      tagline: tagline || null,
      overview: overview || `Community profile for ${name} in ${lgaName} LGA.`,
      lga: lgaName,
      lgaId: lgaRows[0].id,
      districtOrClan: tagline || `${lgaName} LGA`,
      createdById: session.user.id,
      createdBy: session.user.name || session.user.email || 'Admin',
      status: 'published',
      featured: false,
      updatedAt: new Date(),
    }).returning({ id: communitiesSchema.id });

    if (!inserted) {
      throw new Error('Failed to insert community.');
    }

    await insertAuditLog({
      actorId: session.user.id,
      action: 'create',
      targetType: 'community',
      targetId: String(inserted.id),
      after: { name, lgaName },
    });

    revalidateTag('communities', 'max');
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
    console.error('Error creating community:', error);
    return { success: false, message: 'Failed to create community. Please try again.' };
  }

  redirect('/admin/communities');
}

// ---------------------------------------------------------------
// COMMUNITY UPDATE
// ---------------------------------------------------------------

export async function updateTownAction(
  townIdStr: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const townId = Number.parseInt(townIdStr, 10);
    if (Number.isNaN(townId)) {
      return { success: false, message: 'Invalid community ID.' };
    }

    const parsed = UpdateTownSchema.safeParse({
      name:             formData.get('name'),
      lga:              formData.get('lga'),
      tagline:          formData.get('tagline'),
      overview:         formData.get('overview'),
      published:        formData.get('published') ?? 'false',
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? 'Validation failed.' };
    }

    const { name, lga: lgaName, tagline, overview, published } = parsed.data;

    const lgaRows = await db
      .select({ id: lgaTable.id })
      .from(lgaTable)
      .where(eq(lgaTable.name, lgaName))
      .limit(1);

    if (!lgaRows[0]) {
      return { success: false, message: `LGA "${lgaName}" not found.` };
    }

    // Snapshot before update
    const [before] = await db.select().from(communitiesSchema).where(eq(communitiesSchema.id, townId)).limit(1);

    await db
      .update(communitiesSchema)
      .set({
        name,
        slug: generateSlug(name),
        tagline: tagline || null,
        overview,
        lga: lgaName,
        lgaId: lgaRows[0].id,
        districtOrClan: tagline || `${lgaName} LGA`,
        status: published ? 'published' : 'draft',
        updatedAt: new Date(),
      })
      .where(eq(communitiesSchema.id, townId));

    await insertAuditLog({
      actorId: session.user.id,
      action: published ? 'publish' : 'unpublish',
      targetType: 'community',
      targetId: townIdStr,
      before: before ?? undefined,
      after: { name, published },
    });

    revalidateTag('communities', 'max');
    revalidateTag(`community-${townIdStr}`, 'max');
    return { success: true, message: 'Community updated successfully.' };
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
    console.error('Error updating community:', error);
    return { success: false, message: 'Failed to update community.' };
  }
}

// ---------------------------------------------------------------
// TOGGLE PUBLISH
// ---------------------------------------------------------------

export async function toggleTownPublishedAction(
  townIdStr: string,
  published: boolean,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const townId = Number.parseInt(townIdStr, 10);
    if (Number.isNaN(townId)) {
      return { success: false, message: 'Invalid community ID.' };
    }

    await db
      .update(communitiesSchema)
      .set({ status: published ? 'published' : 'draft', updatedAt: new Date() })
      .where(eq(communitiesSchema.id, townId));

    await insertAuditLog({
      actorId: session.user.id,
      action: published ? 'publish' : 'unpublish',
      targetType: 'community',
      targetId: townIdStr,
    });

    revalidateTag('communities', 'max');
    revalidateTag(`community-${townIdStr}`, 'max');
    return { success: true, message: published ? 'Community published.' : 'Community unpublished.' };
  } catch (error) {
    console.error('Error toggling publish:', error);
    return { success: false, message: 'Failed to update community.' };
  }
}

// ---------------------------------------------------------------
// DELETE COMMUNITY
// ---------------------------------------------------------------

export async function deleteTownAction(townIdStr: string): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const townId = Number.parseInt(townIdStr, 10);
    if (Number.isNaN(townId)) {
      return { success: false, message: 'Invalid community ID.' };
    }

    const [before] = await db.select().from(communitiesSchema).where(eq(communitiesSchema.id, townId)).limit(1);

    await db.delete(communitiesSchema).where(eq(communitiesSchema.id, townId));

    await insertAuditLog({
      actorId: session.user.id,
      action: 'delete',
      targetType: 'community',
      targetId: townIdStr,
      before: before ?? undefined,
    });

    revalidateTag('communities', 'max');
    return { success: true, message: 'Community deleted.' };
  } catch (error) {
    console.error('Error deleting community:', error);
    return { success: false, message: 'Failed to delete community.' };
  }
}

// ---------------------------------------------------------------
// USER ROLE MANAGEMENT
// ---------------------------------------------------------------

export async function updateUserRoleAction(
  targetUserId: string,
  newRole: 'USER' | 'ADMIN',
): Promise<ActionState> {
  try {
    const session = await requireRole('SUPER_ADMIN');

    const parsed = UpdateUserRoleSchema.safeParse({ targetUserId, newRole });
    if (!parsed.success) {
      return { success: false, message: 'Invalid role data.' };
    }

    if (targetUserId === session.user.id) {
      return { success: false, message: 'You cannot change your own role.' };
    }

    const [before] = await db.select({ role: userTable.role }).from(userTable).where(eq(userTable.id, targetUserId)).limit(1);

    await db
      .update(userTable)
      .set({ role: newRole, updatedAt: new Date() })
      .where(eq(userTable.id, targetUserId));

    await insertAuditLog({
      actorId: session.user.id,
      action: 'update_role',
      targetType: 'user',
      targetId: targetUserId,
      before: before ?? undefined,
      after: { role: newRole },
    });

    return { success: true, message: `User role updated to ${newRole}.` };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, message: 'Failed to update user role.' };
  }
}

// ---------------------------------------------------------------
// CURATION QUEUE ACTIONS
// ---------------------------------------------------------------

export async function approveTownAction(townIdStr: string): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const townId = Number.parseInt(townIdStr, 10);
    if (Number.isNaN(townId)) {
      return { success: false, message: 'Invalid community ID.' };
    }

    await db.update(communitiesSchema).set({ status: 'published', updatedAt: new Date() }).where(eq(communitiesSchema.id, townId));

    await insertAuditLog({ actorId: session.user.id, action: 'publish', targetType: 'community', targetId: townIdStr });

    revalidateTag('communities', 'max');
    return { success: true, message: 'Town approved and published.' };
  } catch (error) {
    console.error('Error approving town:', error);
    return { success: false, message: 'Failed to approve town.' };
  }
}

export async function rejectTownAction(townIdStr: string): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const townId = Number.parseInt(townIdStr, 10);
    if (Number.isNaN(townId)) {
      return { success: false, message: 'Invalid community ID.' };
    }

    await db.delete(communitiesSchema).where(eq(communitiesSchema.id, townId));

    await insertAuditLog({ actorId: session.user.id, action: 'delete', targetType: 'community', targetId: townIdStr });

    revalidateTag('communities', 'max');
    return { success: true, message: 'Town submission rejected and removed.' };
  } catch (error) {
    console.error('Error rejecting town:', error);
    return { success: false, message: 'Failed to reject town.' };
  }
}

export async function submitTownRevisionAction(
  townIdStr: string,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');
    const townId = Number.parseInt(townIdStr, 10);
    if (Number.isNaN(townId)) {
      return { success: false, message: 'Invalid community ID.' };
    }

    const name = (formData.get('name') as string | null)?.trim() ?? '';
    const overview = (formData.get('overview') as string | null)?.trim() ?? '';

    if (!name || !overview) {
      return { success: false, message: 'Name and overview are required.' };
    }

    await db
      .update(communitiesSchema)
      .set({
        name,
        tagline: (formData.get('tagline') as string) || null,
        overview,
        updatedAt: new Date(),
      })
      .where(eq(communitiesSchema.id, townId));

    await insertAuditLog({ actorId: session.user.id, action: 'edit', targetType: 'community', targetId: townIdStr });

    revalidateTag('communities', 'max');
    revalidateTag(`community-${townIdStr}`, 'max');
    return { success: true, message: 'Changes applied directly.' };
  } catch (error) {
    console.error('Error submitting revision:', error);
    return { success: false, message: 'Failed to submit edit. Please try again.' };
  }
}

export async function approveRevisionAction(revisionId: number): Promise<ActionState> {
  try {
    const session = await requireRole('MODERATOR');

    const [revision] = await db
      .select()
      .from(communityRevisionsTable)
      .where(eq(communityRevisionsTable.id, revisionId))
      .limit(1);

    if (!revision) return { success: false, message: 'Revision not found.' };

    await db
      .update(communitiesSchema)
      .set({
        name: revision.name,
        tagline: revision.tagline,
        overview: revision.overview,
        updatedAt: new Date(),
      })
      .where(eq(communitiesSchema.id, revision.communityId));

    await db
      .update(communityRevisionsTable)
      .set({ status: 'approved' })
      .where(eq(communityRevisionsTable.id, revisionId));

    await insertAuditLog({ actorId: session.user.id, action: 'approve_revision', targetType: 'revision', targetId: String(revisionId) });

    revalidateTag('communities', 'max');
    return { success: true, message: 'Revision approved and changes applied.' };
  } catch (error) {
    console.error('Error approving revision:', error);
    return { success: false, message: 'Failed to approve revision.' };
  }
}

export async function rejectRevisionAction(revisionId: number): Promise<ActionState> {
  try {
    const session = await requireRole('MODERATOR');

    await db
      .update(communityRevisionsTable)
      .set({ status: 'rejected' })
      .where(eq(communityRevisionsTable.id, revisionId));

    await insertAuditLog({ actorId: session.user.id, action: 'reject_revision', targetType: 'revision', targetId: String(revisionId) });

    return { success: true, message: 'Revision rejected.' };
  } catch (error) {
    console.error('Error rejecting revision:', error);
    return { success: false, message: 'Failed to reject revision.' };
  }
}
