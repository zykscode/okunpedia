import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Newspaper } from 'lucide-react';
import { allBlogs } from 'contentlayer/generated';
import { sortPosts } from 'pliny/utils/contentlayer.js';

export const metadata = {
  title: 'Publications & News — Okunpedia',
  description:
    'Read peer-reviewed documentation chapters, developmental blueprints, and cultural restoration updates from across Okunland.',
};

const categoryStyles: Record<string, { badge: 'amber' | 'emerald' | 'blue'; label: string }> = {
  development: { badge: 'amber', label: 'Development' },
  history: { badge: 'emerald', label: 'History' },
  culture: { badge: 'blue', label: 'Culture' },
};

export default async function BlogPage() {
  const displayPosts = sortPosts(allBlogs).map(post => ({
    id: post._id,
    title: post.title,
    slug: post.slug,
    category: post.tags && post.tags.length > 0 ? post.tags[0] : 'culture',
    excerpt: post.summary,
    publishedAt: new Date(post.date),
  }));

  const [featurePost, ...secondaryPosts] = displayPosts;

  return (
    <div className="space-y-12">
      {/* Page header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-14 text-center text-white shadow-xl sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" aria-hidden="true" />
        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold tracking-wider text-blue-300 uppercase ring-1 ring-blue-500/20">
            <Newspaper className="size-3.5" aria-hidden="true" />
            Official Publication Desk
          </div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Publications & News
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Academic essays, development tracking updates, and cultural symposium notes curated by
            the historical verification network.
          </p>
        </div>
      </div>

      {/* Feature post */}
      {featurePost && (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs transition-all duration-300 hover:border-blue-400/40 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/60">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-blue-600 to-indigo-500" aria-hidden="true" />
          <div className="p-6 pl-9 sm:p-8 sm:pl-11">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Badge variant="blue">Featured</Badge>
                {(() => {
                  const cat = categoryStyles[featurePost.category || 'culture'] ?? categoryStyles.culture;
                  const badge = cat?.badge ?? 'blue';
                  const label = cat?.label ?? featurePost.category;
                  return <Badge variant={badge}>{label}</Badge>;
                })()}
              </div>
              <time
                dateTime={featurePost.publishedAt?.toISOString()}
                className="text-xs font-medium text-gray-400 dark:text-gray-500"
              >
                {featurePost.publishedAt?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
            </div>

            <h2 className="mt-5 font-serif text-2xl font-extrabold tracking-tight text-gray-900 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400 sm:text-3xl lg:text-4xl">
              <Link href={`/blog/${featurePost.slug}/`} className="focus:outline-hidden">
                {featurePost.title}
              </Link>
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
              {featurePost.excerpt}
            </p>

            <div className="mt-6 pt-2">
              <Link href={`/blog/${featurePost.slug}/`} className="focus:outline-hidden">
                <Button variant="primary" size="md">
                  Read Full Article
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Secondary posts */}
      {secondaryPosts.length > 0 && (
        <section>
          <h2 className="mb-6 font-serif text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Recent Articles
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {secondaryPosts.map((post) => {
              const cat = categoryStyles[post.category || 'culture'] ?? { badge: 'blue' as const, label: 'Culture' };
              const borderHover =
                post.category === 'development' ? 'hover:border-amber-400/40'
                  : post.category === 'history' ? 'hover:border-emerald-400/40'
                    : 'hover:border-blue-400/40';

              return (
                <article
                  key={post.id}
                  className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/60 ${borderHover}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={cat.badge}>{cat.label}</Badge>
                      <time
                        dateTime={post.publishedAt?.toISOString()}
                        className="text-xs font-medium text-gray-400 dark:text-gray-500"
                      >
                        {post.publishedAt?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </time>
                    </div>
                    <h3 className="mt-4 font-serif text-base font-bold tracking-tight text-gray-900 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400 sm:text-lg">
                      {post.title}
                    </h3>
                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800">
                    <Link
                      href={`/blog/${post.slug}/`}
                      className="flex items-center justify-between text-sm font-semibold text-blue-700 no-underline transition-colors hover:text-blue-600 focus:outline-hidden dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <span>Read article</span>
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
