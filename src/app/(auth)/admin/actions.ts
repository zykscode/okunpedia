'use server';

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { blogPostsSchema, townTable, lgaTable } from '@/models/Schema';

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
    const { userId } = await auth();

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
    const { userId } = await auth();

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

    await db.insert(townTable).values({
      id,
      name,
      slug,
      tagline: tagline || null,
      overview: overview || `Community profile for ${name} in ${lgaName} LGA.`,
      lgaId: lgaRows[0].id,
      createdById: userId,
      published: true,
      featured: false,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating community:', error);
    return { success: false, message: 'Failed to create community. Please try again.' };
  }

  // Redirect must be called outside try/catch block
  redirect('/admin');
}
