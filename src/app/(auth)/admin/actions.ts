'use server';

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/libs/DB';
import { blogPostsSchema, communitiesSchema } from '@/models/Schema';

export type ActionState = {
  success: boolean;
  message: string;
};

// Simple slug generator helper
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

export async function publishBlogAction(
  _prevState: ActionState,
  formData: FormData
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
  
  // Redirect must be called outside try/catch block because it throws an error to function
  redirect('/admin');
}

export async function createCommunityAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: 'Unauthorized. Please sign in.' };
    }

    const nameEntry = formData.get('name');
    const name = typeof nameEntry === 'string' ? nameEntry : '';

    const lgaEntry = formData.get('lga');
    const lga = typeof lgaEntry === 'string' ? lgaEntry : '';

    const clanEntry = formData.get('districtOrClan');
    const districtOrClan = typeof clanEntry === 'string' ? clanEntry : '';

    const historyEntry = formData.get('historicalBackground');
    const historicalBackground = typeof historyEntry === 'string' ? historyEntry : '';

    if (!name || !lga) {
      return { success: false, message: 'Missing required parameters.' };
    }

    const slug = generateSlug(name);

    await db.insert(communitiesSchema).values({
      name,
      slug,
      lga,
      districtOrClan: districtOrClan ?? 'General',
      historicalBackground,
      createdBy: userId,
    });

  } catch (error) {
    console.error('Error creating community:', error);
    return { success: false, message: 'Failed to create community. Please try again.' };
  }

  // Redirect must be called outside try/catch block
  redirect('/admin');
}
