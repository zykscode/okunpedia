'use client';

import { usePathname } from 'next/navigation';
import { slug } from 'github-slugger';
import { format } from 'date-fns';
import { Link } from '@/libs/I18nNavigation';
import Tag from './Tag';

type BlogPostPreview = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date | null;
  category: string;
};

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

interface ListLayoutProps {
  posts: BlogPostPreview[];
  title: string;
  initialDisplayPosts?: BlogPostPreview[];
  pagination?: PaginationProps;
  categories: Record<string, number>;
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const basePath = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/page\/\d+\/?$/, '') // Remove any trailing /page
    .replace(/\/$/, ''); // Remove trailing slash
  const prevPage = currentPage - 1 > 0;
  const nextPage = currentPage + 1 <= totalPages;

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            className="hover:text-emerald-600 transition-colors"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next" className="hover:text-emerald-600 transition-colors">
            Next
          </Link>
        )}
      </nav>
    </div>
  );
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  categories,
}: ListLayoutProps) {
  const pathname = usePathname();
  const categoryKeys = Object.keys(categories);
  const sortedCategories = categoryKeys.sort((a, b) => (categories[b] || 0) - (categories[a] || 0));

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="pt-6 pb-6">
        <h1 className="font-serif text-3xl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-gray-100">
          {title}
        </h1>
      </div>
      <div className="flex sm:space-x-12">
        <div className="hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded-2xl bg-white p-6 shadow-xs border border-gray-200/80 sm:flex dark:border-gray-800 dark:bg-gray-900/60">
          <div className="w-full">
            {pathname.startsWith('/blog/category') ? (
              <Link
                href="/blog"
                className="font-bold text-gray-700 uppercase hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors"
              >
                All Posts
              </Link>
            ) : (
              <h3 className="font-bold uppercase text-emerald-600 dark:text-emerald-400">All Posts</h3>
            )}
            <ul className="mt-4">
              {sortedCategories.map((c) => {
                const isActive = pathname.includes(`/blog/category/${slug(c)}`);
                return (
                  <li key={c} className="my-3">
                    {isActive ? (
                      <h3 className="inline text-sm font-bold uppercase text-emerald-600 dark:text-emerald-400">
                        {`${c} (${categories[c]})`}
                      </h3>
                    ) : (
                      <Link
                        href={`/blog/category/${slug(c)}`}
                        className="text-sm font-medium text-gray-500 uppercase hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
                        aria-label={`View posts in category ${c}`}
                      >
                        {`${c} (${categories[c]})`}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="flex-1">
          <ul>
            {displayPosts.map((post) => {
              const { slug: postSlug, publishedAt, title, excerpt, category } = post;
              return (
                <li key={postSlug} className="py-5">
                  <article className="group relative flex flex-col space-y-3 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60 xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        <time dateTime={publishedAt ? publishedAt.toISOString() : ''} suppressHydrationWarning>
                          {publishedAt ? format(publishedAt, 'MMMM d, yyyy') : 'Draft'}
                        </time>
                      </dd>
                    </dl>
                    <div className="space-y-3">
                      <div>
                        <h2 className="font-serif text-2xl font-bold leading-8 tracking-tight">
                          <Link href={`/blog/${postSlug}`} className="text-gray-900 transition-colors group-hover:text-emerald-600 dark:text-gray-100 dark:group-hover:text-emerald-400">
                            {title}
                          </Link>
                        </h2>
                        <div className="mt-3 flex flex-wrap">
                          <Tag text={category} />
                        </div>
                      </div>
                      <div className="prose max-w-none text-gray-500 dark:prose-invert dark:text-gray-400">
                        {excerpt}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
          {pagination && pagination.totalPages > 1 && (
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          )}
        </div>
      </div>
    </div>
  );
}
