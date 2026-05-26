// oxlint-disable unicorn/prefer-string-replace-all
// oxlint-disable jsdoc/require-param
// oxlint-disable require-unicode-regexp
// oxlint-disable jsdoc/require-returns
// oxlint-disable typescript/no-unnecessary-type-conversion
// oxlint-disable typescript/no-unsafe-type-assertion
// oxlint-disable typescript/consistent-return
'use server';

import { eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/libs/DB';
import { blogPostsSchema, townTable, lgaTable, townRevisionsTable } from '@/models/Schema';

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

export async function publishBlogAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, message: 'Unauthorized. Please sign in.' };
    }

    const titleEntry = formData.get('title');
    const title = typeof titleEntry === 'string' ? titleEntry : '';

    const excerptEntry = formData.get('excerpt');
    const excerpt = typeof excerptEntry === 'string' ? excerptEntry : '';

    const contentEntry = formData.get('content');
    const content = typeof contentEntry === 'string' ? contentEntry : '';

    const catEntry = formData.get('category');
    const category = typeof catEntry === 'string' ? catEntry : '';

    if (!title || !content) {
      return { success: false, message: 'Missing required article contents.' };
    }

    const slug = generateSlug(title);

    await db.insert(blogPostsSchema).values({
      title,
      slug,
      excerpt: excerpt ?? '',
      content,
      category: category ?? 'history',
      authorId: userId,
      status: 'published',
      publishedAt: new Date(),
    });
    updateTag('blog-posts');
  } catch (error) {
    console.error('Error creating blog post:', error);
    return { success: false, message: 'Failed to create blog post. Please try again.' };
  }

  // Redirect must be called outside try/catch block because it throws
  redirect('/admin');
}

export async function createCommunityAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const role = session?.user?.role;

    if (!userId) {
      return { success: false, message: 'Unauthorized. Please sign in.' };
    }

    const nameEntry = formData.get('name');
    const name = typeof nameEntry === 'string' ? nameEntry.trim() : '';

    const lgaNameEntry = formData.get('lga');
    const lgaName = typeof lgaNameEntry === 'string' ? lgaNameEntry : '';

    const taglineEntry = formData.get('districtOrClan');
    const tagline = typeof taglineEntry === 'string' ? taglineEntry.trim() : '';

    const overviewEntry = formData.get('historicalBackground');
    const overview = typeof overviewEntry === 'string' ? overviewEntry.trim() : '';

    if (!name || !lgaName) {
      return { success: false, message: 'Missing required parameters.' };
    }

    // Look up the LGA record by display name
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
      published: isAdmin, // Auto-published only for admins
      featured: false,
      updatedAt: new Date(),
    });
    updateTag('communities');
  } catch (error) {
    console.error('Error creating community:', error);
    return { success: false, message: 'Failed to create community. Please try again.' };
  }

  // Redirect must be called outside try/catch block
  redirect('/admin');
}

// -------------------------------------------------------------
// ADMIN APPROVAL ACTIONS
// -------------------------------------------------------------

export async function approveTownAction(townId: string): Promise<ActionState> {
  try {
    const session = await auth();
    const role = session?.user?.role;
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      return { success: false, message: 'Unauthorized. Admin privileges required.' };
    }

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
    const session = await auth();
    const role = session?.user?.role;
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      return { success: false, message: 'Unauthorized. Admin privileges required.' };
    }

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

    if (isAdmin) {
      // Admins apply edits immediately
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
    }

    // Normal contributors submit a pending revision
    await db.insert(townRevisionsTable).values({
      townId,
      name,
      tagline: tagline || null,
      overview,
      rulerTitle: rulerTitle || null,
      traditionalRuler: traditionalRuler || null,
      submittedById: userId,
      status: 'pending',
    });

    updateTag('communities');
    return { success: true, message: 'Edit submitted for review.' };
  } catch (error) {
    console.error('Error submitting revision:', error);
    return { success: false, message: 'Failed to submit edit. Please try again.' };
  }
}

export async function approveRevisionAction(revisionId: number): Promise<ActionState> {
  try {
    const session = await auth();
    const role = session?.user?.role;
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      return { success: false, message: 'Unauthorized. Admin privileges required.' };
    }

    const [revision] = await db
      .select()
      .from(townRevisionsTable)
      .where(eq(townRevisionsTable.id, revisionId))
      .limit(1);

    if (!revision) {
      return { success: false, message: 'Revision not found.' };
    }

    // Apply changes to the Town table
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

    // Update revision status
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
    const session = await auth();
    const role = session?.user?.role;
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      return { success: false, message: 'Unauthorized. Admin privileges required.' };
    }

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
