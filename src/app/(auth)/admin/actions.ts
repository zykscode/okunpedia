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
  townTable,
  lgaTable,
  townRevisionsTable,
  userTable,
  auditLogsTable,
  communitiesSchema,
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

/** Generates a CUID-like ID for Prisma-managed rows. */
const generateId = () =>
  `cmp_${Math.random().toString(36).slice(2, 11)}_${Date.now().toString(36)}`;

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
  rulerTitle:        z.string().max(100).optional(),
  traditionalRuler:  z.string().max(200).optional(),
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
    const id = generateId();

    await db.insert(townTable).values({
      id,
      name,
      slug,
      tagline: tagline || null,
      overview: overview || `Community profile for ${name} in ${lgaName} LGA.`,
      lgaId: lgaRows[0].id,
      createdById: session.user.id,
      published: true,
      featured: false,
      updatedAt: new Date(),
    });

    await insertAuditLog({
      actorId: session.user.id,
      action: 'create',
      targetType: 'community',
      targetId: id,
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
  townId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');

    const parsed = UpdateTownSchema.safeParse({
      name:             formData.get('name'),
      lga:              formData.get('lga'),
      tagline:          formData.get('tagline'),
      overview:         formData.get('overview'),
      rulerTitle:       formData.get('rulerTitle'),
      traditionalRuler: formData.get('traditionalRuler'),
      published:        formData.get('published') ?? 'false',
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? 'Validation failed.' };
    }

    const { name, lga: lgaName, tagline, overview, rulerTitle, traditionalRuler, published } = parsed.data;

    const lgaRows = await db
      .select({ id: lgaTable.id })
      .from(lgaTable)
      .where(eq(lgaTable.name, lgaName))
      .limit(1);

    if (!lgaRows[0]) {
      return { success: false, message: `LGA "${lgaName}" not found.` };
    }

    // Snapshot before update
    const [before] = await db.select().from(townTable).where(eq(townTable.id, townId)).limit(1);

    await db
      .update(townTable)
      .set({
        name,
        slug: generateSlug(name),
        tagline: tagline || null,
        overview,
        lgaId: lgaRows[0].id,
        rulerTitle: rulerTitle || null,
        traditionalRuler: traditionalRuler || null,
        published,
        updatedAt: new Date(),
      })
      .where(eq(townTable.id, townId));

    if (before?.slug) {
      await db
        .update(communitiesSchema)
        .set({
          name,
          slug: generateSlug(name),
          lga: lgaName,
          districtOrClan: tagline || '',
          updatedAt: new Date(),
        })
        .where(eq(communitiesSchema.slug, before.slug));
    }

    await insertAuditLog({
      actorId: session.user.id,
      action: published ? 'publish' : 'unpublish',
      targetType: 'community',
      targetId: townId,
      before: before ?? undefined,
      after: { name, published },
    });

    revalidateTag('communities', 'max');
    revalidateTag(`community-${townId}`, 'max');
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
  townId: string,
  published: boolean,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');

    await db
      .update(townTable)
      .set({ published, updatedAt: new Date() })
      .where(eq(townTable.id, townId));

    await insertAuditLog({
      actorId: session.user.id,
      action: published ? 'publish' : 'unpublish',
      targetType: 'community',
      targetId: townId,
    });

    revalidateTag('communities', 'max');
    revalidateTag(`community-${townId}`, 'max');
    return { success: true, message: published ? 'Community published.' : 'Community unpublished.' };
  } catch (error) {
    console.error('Error toggling publish:', error);
    return { success: false, message: 'Failed to update community.' };
  }
}

// ---------------------------------------------------------------
// DELETE COMMUNITY
// ---------------------------------------------------------------

export async function deleteTownAction(townId: string): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');

    const [before] = await db.select().from(townTable).where(eq(townTable.id, townId)).limit(1);

    await db.delete(townTable).where(eq(townTable.id, townId));

    await insertAuditLog({
      actorId: session.user.id,
      action: 'delete',
      targetType: 'community',
      targetId: townId,
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

export async function approveTownAction(townId: string): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');

    await db.update(townTable).set({ published: true, updatedAt: new Date() }).where(eq(townTable.id, townId));

    await insertAuditLog({ actorId: session.user.id, action: 'publish', targetType: 'community', targetId: townId });

    revalidateTag('communities', 'max');
    return { success: true, message: 'Town approved and published.' };
  } catch (error) {
    console.error('Error approving town:', error);
    return { success: false, message: 'Failed to approve town.' };
  }
}

export async function rejectTownAction(townId: string): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');

    await db.delete(townTable).where(eq(townTable.id, townId));

    await insertAuditLog({ actorId: session.user.id, action: 'delete', targetType: 'community', targetId: townId });

    revalidateTag('communities', 'max');
    return { success: true, message: 'Town submission rejected and removed.' };
  } catch (error) {
    console.error('Error rejecting town:', error);
    return { success: false, message: 'Failed to reject town.' };
  }
}

export async function submitTownRevisionAction(
  townId: string,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireRole('ADMIN');

    const name = (formData.get('name') as string | null)?.trim() ?? '';
    const overview = (formData.get('overview') as string | null)?.trim() ?? '';

    if (!name || !overview) {
      return { success: false, message: 'Name and overview are required.' };
    }

    await db
      .update(townTable)
      .set({
        name,
        tagline: (formData.get('tagline') as string) || null,
        overview,
        rulerTitle: (formData.get('rulerTitle') as string) || null,
        traditionalRuler: (formData.get('traditionalRuler') as string) || null,
        updatedAt: new Date(),
      })
      .where(eq(townTable.id, townId));

    await insertAuditLog({ actorId: session.user.id, action: 'edit', targetType: 'community', targetId: townId });

    revalidateTag('communities', 'max');
    revalidateTag(`community-${townId}`, 'max');
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
      .from(townRevisionsTable)
      .where(eq(townRevisionsTable.id, revisionId))
      .limit(1);

    if (!revision) return { success: false, message: 'Revision not found.' };

    await db
      .update(townTable)
      .set({
        name: revision.name,
        tagline: revision.tagline,
        overview: revision.overview,
        rulerTitle: revision.rulerTitle,
        traditionalRuler: revision.traditionalRuler,
        updatedAt: new Date(),
      })
      .where(eq(townTable.id, revision.townId));

    await db
      .update(townRevisionsTable)
      .set({ status: 'approved' })
      .where(eq(townRevisionsTable.id, revisionId));

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
      .update(townRevisionsTable)
      .set({ status: 'rejected' })
      .where(eq(townRevisionsTable.id, revisionId));

    await insertAuditLog({ actorId: session.user.id, action: 'reject_revision', targetType: 'revision', targetId: String(revisionId) });

    return { success: true, message: 'Revision rejected.' };
  } catch (error) {
    console.error('Error rejecting revision:', error);
    return { success: false, message: 'Failed to reject revision.' };
  }
}
