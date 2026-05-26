import { unstable_cache } from 'next/cache';
import { db } from '@/libs/DB';
import { blogPostsSchema } from '@/models/Schema';
import { Newspaper } from 'lucide-react';
import { ListLayout } from '@/components/blog/ListLayout';
import { slug } from 'github-slugger';

export const metadata = {
  title: 'Publications by Category — Okunpedia',
  description: 'Filter peer-reviewed documentation and updates by category across Okunland.',
};

const getBlogPosts = unstable_cache(
  async () => {
    return db.select().from(blogPostsSchema);
  },
  ['all-blog-posts-cache'],
  { tags: ['blog-posts'] }
);

export async function generateStaticParams() {
  let posts: Array<typeof blogPostsSchema.$inferSelect> = [];
  try {
    posts = await getBlogPosts();
  } catch {
    posts = [];
  }
  const categories = new Set(posts.map((p) => slug(p.category || 'Uncategorized')));
  // Pre-render standard fallback categories
  categories.add('history');
  categories.add('culture');
  categories.add('news');
  categories.add('development');
  categories.add('editorial');
  
  return Array.from(categories).map((cat) => ({
    category: cat,
  }));
}

export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const categoryParam = params.category;

  let posts: Array<typeof blogPostsSchema.$inferSelect> = [];
  try {
    posts = await getBlogPosts();
  } catch {
    posts = [];
  }

  // Fallback if db fails
  const staticPosts = [
    {
      id: 1,
      title: 'Documenting the Nupe-Okun Historical Migrations',
      slug: 'nupe-okun-migrations',
      category: 'history',
      excerpt: 'An investigative exploration tracing back the pre-colonial boundary dynamics...',
      publishedAt: new Date('2026-03-15'),
      content: '',
    },
    {
      id: 2,
      title: 'Infrastructure Deficits: Addressing the Mopa-Muro Road Network',
      slug: 'mopa-muro-road-deficits',
      category: 'development',
      excerpt: 'A critical review of municipal bypass conditions detailing targeted action pathways...',
      publishedAt: new Date('2026-04-10'),
      content: '',
    },
  ];

  const allPosts = posts.length > 0 ? posts : staticPosts;

  const categoriesCount = allPosts.reduce((acc, post) => {
    const cat = post.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredPosts = allPosts.filter((post) => {
    const postCategorySlug = slug(post.category || 'Uncategorized');
    return postCategorySlug === categoryParam;
  });

  const formattedPosts = filteredPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    category: post.category || 'Uncategorized',
  }));

  const POSTS_PER_PAGE = 5;
  const pageNumber = 1;
  const totalPages = Math.ceil(formattedPosts.length / POSTS_PER_PAGE);
  const initialDisplayPosts = formattedPosts.slice(0, POSTS_PER_PAGE * pageNumber);
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  };

  const title = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).replace(/-/g, ' ');

  return (
    <div className="space-y-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-14 text-center text-white shadow-xl sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" aria-hidden="true" />
        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold tracking-wider text-blue-300 uppercase ring-1 ring-blue-500/20">
            <Newspaper className="size-3.5" aria-hidden="true" />
            Filtered Category
          </div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Academic essays, development tracking updates, and cultural symposium notes curated by
            the historical verification network.
          </p>
        </div>
      </div>

      <ListLayout
        posts={formattedPosts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title={title}
        categories={categoriesCount}
      />
    </div>
  );
}
