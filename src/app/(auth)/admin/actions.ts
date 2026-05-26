// oxlint-disable unicorn/prefer-string-replace-all
// oxlint-disable jsdoc/require-param
// oxlint-disable require-unicode-regexp
// oxlint-disable jsdoc/require-returns
'use server';

import { eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/libs/DB';
import { townTable, lgaTable, townRevisionsTable, userTable } from '@/models/Schema';

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

/** Checks if session user is an admin. */
async function requireAdmin(): Promise<{ userId: string; role: string } | ActionState> {
  const session = await auth();
  const userId = session?.user?.id;
  const role = session?.user?.role ?? 'USER';

  if (!userId) {
    return { success: false, message: 'Unauthorized. Please sign in.' };
  }
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
    return { success: false, message: 'Unauthorized. Admin privileges required.' };
  }
  return { userId, role };
}

// -------------------------------------------------------------
// COMMUNITY CREATE
// -------------------------------------------------------------

export async function createCommunityAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const auth = await requireAdmin();
    if ('message' in auth && !auth.success) return auth as ActionState;
    const { userId, role } = auth as { userId: string; role: string };

    const name = (formData.get('name') as string | null)?.trim() ?? '';
    const lgaName = (formData.get('lga') as string | null) ?? '';
    const tagline = (formData.get('districtOrClan') as string | null)?.trim() ?? '';
    const overview = (formData.get('historicalBackground') as string | null)?.trim() ?? '';

    if (!name || !lgaName) {
      return { success: false, message: 'Missing required parameters.' };
    }

    const lgaRows = await db
      .select({ id: lgaTable.id })
      .from(lgaTable)
      .where(eq(lgaTable.name, lgaName))
      .limit(1);

    if (!lgaRows[0]) {
      return { success: false, message: `LGA "${lgaName}" not found in the database.` };
    }

    const slug = generateSlug(name);
    const id = generateId();
    const isAdmin = role === 'SUPER_ADMIN' || role === 'ADMIN';

    await db.insert(townTable).values({
      id,
      name,
      slug,
      tagline: tagline || null,
      overview: overview || `Community profile for ${name} in ${lgaName} LGA.`,
      lgaId: lgaRows[0].id,
      createdById: userId,
      published: isAdmin,
      featured: false,
      updatedAt: new Date(),
    });
    updateTag('communities');
  } catch (error) {
    console.error('Error creating community:', error);
    return { success: false, message: 'Failed to create community. Please try again.' };
  }

  redirect('/admin/communities');
}

// -------------------------------------------------------------
// COMMUNITY UPDATE
// -------------------------------------------------------------

export async function updateTownAction(
  townId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const auth = await requireAdmin();
    if ('message' in auth && !auth.success) return auth as ActionState;

    const name = (formData.get('name') as string | null)?.trim() ?? '';
    const tagline = formData.get('tagline') as string | null;
    const overview = (formData.get('overview') as string | null)?.trim() ?? '';
    const rulerTitle = formData.get('rulerTitle') as string | null;
    const traditionalRuler = formData.get('traditionalRuler') as string | null;
    const publishedRaw = formData.get('published');
    const published = publishedRaw === 'true';

    if (!name || !overview) {
      return { success: false, message: 'Name and overview are required.' };
    }

    await db
      .update(townTable)
      .set({
        name,
        slug: generateSlug(name),
        tagline: tagline || null,
        overview,
        rulerTitle: rulerTitle || null,
        traditionalRuler: traditionalRuler || null,
        published,
        updatedAt: new Date(),
      })
      .where(eq(townTable.id, townId));

    updateTag('communities');
    return { success: true, message: 'Community updated successfully.' };
  } catch (error) {
    console.error('Error updating community:', error);
    return { success: false, message: 'Failed to update community.' };
  }
}

// -------------------------------------------------------------
// COMMUNITY TOGGLE PUBLISH
// -------------------------------------------------------------

export async function toggleTownPublishedAction(
  townId: string,
  published: boolean,
): Promise<ActionState> {
  try {
    const auth = await requireAdmin();
    if ('message' in auth && !auth.success) return auth as ActionState;

    await db
      .update(townTable)
      .set({ published, updatedAt: new Date() })
      .where(eq(townTable.id, townId));

    updateTag('communities');
    return { success: true, message: published ? 'Community published.' : 'Community unpublished.' };
  } catch (error) {
    console.error('Error toggling town:', error);
    return { success: false, message: 'Failed to update community.' };
  }
}

// -------------------------------------------------------------
// COMMUNITY DELETE
// -------------------------------------------------------------

export async function deleteTownAction(townId: string): Promise<ActionState> {
  try {
    const auth = await requireAdmin();
    if ('message' in auth && !auth.success) return auth as ActionState;

    await db.delete(townTable).where(eq(townTable.id, townId));

    updateTag('communities');
    return { success: true, message: 'Community deleted.' };
  } catch (error) {
    console.error('Error deleting town:', error);
    return { success: false, message: 'Failed to delete community.' };
  }
}

// -------------------------------------------------------------
// USER ROLE MANAGEMENT (SUPER_ADMIN only)
// -------------------------------------------------------------

export async function updateUserRoleAction(
  targetUserId: string,
  newRole: 'USER' | 'ADMIN',
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized. Please sign in.' };
    }
    if (session.user.role !== 'SUPER_ADMIN') {
      return { success: false, message: 'Only super-admins can manage user roles.' };
    }
    if (targetUserId === session.user.id) {
      return { success: false, message: 'You cannot change your own role.' };
    }

    await db
      .update(userTable)
      .set({ role: newRole, updatedAt: new Date() })
      .where(eq(userTable.id, targetUserId));

    return { success: true, message: `User role updated to ${newRole}.` };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, message: 'Failed to update user role.' };
  }
}

// -------------------------------------------------------------
// ADMIN APPROVAL ACTIONS
// -------------------------------------------------------------

export async function approveTownAction(townId: string): Promise<ActionState> {
  try {
    const auth = await requireAdmin();
    if ('message' in auth && !auth.success) return auth as ActionState;

    await db
      .update(townTable)
      .set({ published: true, updatedAt: new Date() })
      .where(eq(townTable.id, townId));

    updateTag('communities');
    return { success: true, message: 'Town approved and published.' };
  } catch (error) {
    console.error('Error approving town:', error);
    return { success: false, message: 'Failed to approve town.' };
  }
}

export async function rejectTownAction(townId: string): Promise<ActionState> {
  try {
    const auth = await requireAdmin();
    if ('message' in auth && !auth.success) return auth as ActionState;

    await db.delete(townTable).where(eq(townTable.id, townId));

    updateTag('communities');
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
    const session = await auth();
    const userId = session?.user?.id;
    const role = session?.user?.role;

    if (!userId) {
      return { success: false, message: 'Unauthorized. Please sign in.' };
    }

    const name = formData.get('name') as string;
    const tagline = formData.get('tagline') as string;
    const overview = formData.get('overview') as string;
    const rulerTitle = formData.get('rulerTitle') as string;
    const traditionalRuler = formData.get('traditionalRuler') as string;

    if (!name || !overview) {
      return { success: false, message: 'Name and overview are required.' };
    }

    const isAdmin = role === 'SUPER_ADMIN' || role === 'ADMIN';

    if (!isAdmin) {
      return { success: false, message: 'Unauthorized. Admin privileges required.' };
    }

    await db
      .update(townTable)
      .set({
        name,
        tagline: tagline || null,
        overview,
        rulerTitle: rulerTitle || null,
        traditionalRuler: traditionalRuler || null,
        updatedAt: new Date(),
      })
      .where(eq(townTable.id, townId));

    updateTag('communities');
    return { success: true, message: 'Changes applied directly.' };
  } catch (error) {
    console.error('Error submitting revision:', error);
    return { success: false, message: 'Failed to submit edit. Please try again.' };
  }
}

export async function approveRevisionAction(revisionId: number): Promise<ActionState> {
  try {
    const auth = await requireAdmin();
    if ('message' in auth && !auth.success) return auth as ActionState;

    const [revision] = await db
      .select()
      .from(townRevisionsTable)
      .where(eq(townRevisionsTable.id, revisionId))
      .limit(1);

    if (!revision) {
      return { success: false, message: 'Revision not found.' };
    }

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

    updateTag('communities');
    return { success: true, message: 'Revision approved and changes applied.' };
  } catch (error) {
    console.error('Error approving revision:', error);
    return { success: false, message: 'Failed to approve revision.' };
  }
}

export async function rejectRevisionAction(revisionId: number): Promise<ActionState> {
  try {
    const auth = await requireAdmin();
    if ('message' in auth && !auth.success) return auth as ActionState;

    await db
      .update(townRevisionsTable)
      .set({ status: 'rejected' })
      .where(eq(townRevisionsTable.id, revisionId));

    return { success: true, message: 'Revision rejected.' };
  } catch (error) {
    console.error('Error rejecting revision:', error);
    return { success: false, message: 'Failed to reject revision.' };
  }
}
