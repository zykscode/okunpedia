import { db } from '@/libs/DB';
import { Link } from '@/libs/I18nNavigation';
import { blogPostsSchema } from '@/models/Schema';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Okunpedia Publications - Archival Articles & Municipal News',
  description:
    'Read rigorous peer-reviewed documentation chapters, localized developmental blueprints, and updates charting cultural restorations across Okunland.',
};

export default async function BlogPage() {
  // Query blog posts securely with offline fallback insulation
  let posts: Array<typeof blogPostsSchema.$inferSelect> = [];
  try {
    posts = await db.select().from(blogPostsSchema);
  } catch {
    posts = [];
  }

  // Pre-seed offline static preview states if local database is empty
  const displayPosts =
    posts.length > 0
      ? posts
      : [
          {
            id: 1,
            title: 'Documenting the Nupe-Okun Historical Migrations',
            slug: 'nupe-okun-migrations',
            category: 'history',
            excerpt:
              'An investigative exploration tracing back the pre-colonial boundary dynamics, historical conflicts, and cultural cross-pollination between the Okun and bordering Nupe kingdoms.',
            publishedAt: new Date('2026-03-15'),
            content: 'Extensive academic documentation chapters...',
          },
          {
            id: 2,
            title: 'Infrastructure Deficits: Addressing the Mopa-Muro Road Network',
            slug: 'mopa-muro-road-deficits',
            category: 'development',
            excerpt:
              'A critical review of municipal bypass conditions detailing targeted action pathways for indigenous development trust funds to coordinate infrastructural self-help repairs.',
            publishedAt: new Date('2026-04-10'),
            content: 'Civic strategy layout...',
          },
          {
            id: 3,
            title: 'Reviving the Ovia Sacred Festival in Bunu Lands',
            slug: 'reviving-ovia-festival',
            category: 'culture',
            excerpt:
              'Oral historian interviews mapping the ancestral significance of the periodic Ovia ritual celebrations, native chants transcription, and digital audio preservation efforts.',
            publishedAt: new Date('2026-05-02'),
            content: 'Archival documentation...',
          },
          {
            id: 4,
            title: 'Linguistic Mapping: Structural Variance Across Indigenous Okun Dialects',
            slug: 'linguistic-mapping-dialects',
            category: 'culture',
            excerpt:
              'Comprehensive comparative phonetic matrices charting intonation and tonal shifts separating Owe, Yagba, Ijumu, Bunu, and Oworo dialects across indigenous ancestral hamlets.',
            publishedAt: new Date('2026-05-10'),
            content: 'Phonetic tracking documentation...',
          },
        ];

  // Separate the very first item as our Hero Feature post, and the remainder as column feeds
  const [featurePost, ...secondaryPosts] = displayPosts;

  const renderCategoryBadge = (cat: string) => {
    if (cat === 'development') {
      return <Badge variant="amber" className="uppercase font-extrabold">{cat}</Badge>;
    }
    if (cat === 'history') {
      return <Badge variant="emerald" className="uppercase font-extrabold">{cat}</Badge>;
    }
    return <Badge variant="blue" className="uppercase font-extrabold">{cat}</Badge>;
  };

  return (
    <div className="space-y-12 py-4">
      {/* Editorial Header Strip */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-12 text-center text-white shadow-xl transition-colors duration-300 dark:from-gray-950 dark:via-black dark:to-blue-950 sm:px-12">
        {/* Soft geometric backlights */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />

        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-bold tracking-wider text-blue-400 uppercase ring-1 ring-blue-500/20 dark:bg-blue-500/5">
          <span>📰 Official Publication Desk</span>
        </div>

        <h1 className="relative z-10 mt-4 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Publications & News
        </h1>
        <p className="relative z-10 mx-auto mt-3 max-w-2xl text-xs text-slate-300 dark:text-gray-400 sm:text-base">
          Academic essays, development tracking updates, and cultural symposium notes curated by the historical verification network.
        </p>
      </div>

      {/* Primary Hero Feature Block */}
      {featurePost && (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs transition-all duration-300 hover:border-blue-500/40 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-blue-500/30">
          {/* Subtle vertical accent glow line */}
          <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-b from-blue-600 to-indigo-500" />

          <div className="p-6 pl-8 sm:p-8 sm:pl-10">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Badge variant="blue" className="bg-blue-600 text-white dark:bg-blue-600 dark:text-white">
                  Featured Review
                </Badge>
                {renderCategoryBadge(featurePost.category)}
              </div>
              <time
                dateTime={featurePost.publishedAt?.toISOString()}
                className="text-xs font-medium text-gray-400 dark:text-gray-500"
              >
                {featurePost.publishedAt?.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </div>

            <h2 className="mt-5 font-serif text-2xl font-extrabold tracking-tight text-gray-900 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400 sm:text-3xl lg:text-4xl">
              <Link href={`/blog/${featurePost.slug}/`} className="focus:outline-hidden">
                {featurePost.title}
              </Link>
            </h2>

            <p className="mt-4 text-xs leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
              {featurePost.excerpt}
            </p>

            <div className="mt-6 pt-2">
              <Link href={`/blog/${featurePost.slug}/`} className="inline-block focus:outline-hidden">
                <Button variant="primary" size="md">
                  <span>Read Full Dispatch</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Staggered List Grid */}
      {secondaryPosts.length > 0 && (
        <div className="mt-12 space-y-6">
          <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
            Recent Archival Chapters
          </h3>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {secondaryPosts.map((post) => {
              const isDev = post.category === 'development';
              const isHist = post.category === 'history';

              let accentGlow = 'hover:border-blue-500/30';
              if (isDev) {
                accentGlow = 'hover:border-amber-500/30';
              } else if (isHist) {
                accentGlow = 'hover:border-emerald-500/30';
              }

              return (
                <article
                  key={post.id}
                  className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/60 ${accentGlow}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      {renderCategoryBadge(post.category)}
                      <time
                        dateTime={post.publishedAt?.toISOString()}
                        className="text-[11px] font-medium text-gray-400 dark:text-gray-500"
                      >
                        {post.publishedAt?.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    </div>

                    <h4 className="mt-4 font-serif text-base font-bold tracking-tight text-gray-900 transition-colors group-hover:text-blue-950 dark:text-white dark:group-hover:text-blue-400 sm:text-lg">
                      {post.title}
                    </h4>

                    <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Footer Link Strip */}
                  <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
                    <Link href={`/blog/${post.slug}/`} className="block focus:outline-hidden">
                      <Button variant="ghost" size="sm" className="w-full justify-between px-1 text-blue-700 dark:text-blue-400">
                        <span>Review Article</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          &rarr;
                        </span>
                      </Button>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
