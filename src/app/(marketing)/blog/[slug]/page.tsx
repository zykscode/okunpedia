import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { db } from '@/libs/DB';
import { Link } from '@/libs/I18nNavigation';
import { blogPostsSchema } from '@/models/Schema';
import { Button } from '@/components/ui/Button';
import { ArticleHeaderBlock } from '@/features/editorial/ArticleHeaderBlock';

type BlogDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: BlogDetailProps) {
  const params = await props.params;
  const slug = params.slug;

  let records: Array<typeof blogPostsSchema.$inferSelect> = [];
  try {
    records = await db.select().from(blogPostsSchema).where(eq(blogPostsSchema.slug, slug));
  } catch {
    records = [];
  }
  const [record] = records;

  const title = record ? record.title : slug.replace(/-/g, ' ');

  return {
    title: `${title} - Okunpedia Dispatch`,
    description: `Official peer-reviewed archival publication addressing ${title} across Okun municipal districts.`,
  };
}

export default async function BlogDetailPage(props: BlogDetailProps) {
  const params = await props.params;
  const slug = params.slug;

  let records: Array<typeof blogPostsSchema.$inferSelect> = [];
  try {
    records = await db.select().from(blogPostsSchema).where(eq(blogPostsSchema.slug, slug));
  } catch {
    records = [];
  }
  const [dbPost] = records;

  // Fallback static mock dispatches if database is unseeded locally
  const mocks: Record<string, { title: string; category: string; content: string; publishedAt: Date }> = {
    'nupe-okun-migrations': {
      title: 'Documenting the Nupe-Okun Historical Migrations',
      category: 'history',
      publishedAt: new Date('2026-03-15'),
      content:
        'The dynamic frontiers separating the ancestral Okun kingdoms and the downstream Nupe empire were defined by intense regional interactions during the 19th century. Early oral transmissions confirm bilateral trade routes interweaving native woven apparel for agricultural commodities, before administrative boundary demarcations restructured traditional territorial spheres.',
    },
    'mopa-muro-road-deficits': {
      title: 'Infrastructure Deficits: Addressing the Mopa-Muro Road Network',
      category: 'development',
      publishedAt: new Date('2026-04-10'),
      content:
        'Continuous road infrastructure viability remains the foundational prerequisite for accelerating internal trade across Mopa-Muro local government axes. The current state assessment documents targeted priority areas requiring immediate asphalt reinforcement to connect remote farming belts directly with primary commercial terminals.',
    },
    'reviving-ovia-festival': {
      title: 'Reviving the Ovia Sacred Festival in Bunu Lands',
      category: 'culture',
      publishedAt: new Date('2026-05-02'),
      content:
        'Traditional Ovia masquerade invocations represent a profound indigenous heritage framework. Archival fieldwork successfully recorded sacred instrumental ensembles, accompanying tonal linguistic chants, and documented specific sacred groves designated for community generational transition rites.',
    },
    'linguistic-mapping-dialects': {
      title: 'Linguistic Mapping: Structural Variance Across Indigenous Okun Dialects',
      category: 'culture',
      publishedAt: new Date('2026-05-10'),
      content:
        'Phonetic syntax tracking reveals unique structural preservations separating standard Okun from adjacent regional tongues. By analyzing vowel elongation patterns across Owe, Yagba, and Ijumu speakers, researchers established comprehensive historical dialect matrices reflecting centuries of localized evolutionary adaptations.',
    },
  };

  const post = dbPost || (mocks[slug] ? { ...mocks[slug], slug } : null);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl space-y-8 py-8">
      <div>
        <Link href="/blog/" className="inline-block focus:outline-hidden">
          <Button variant="outline" size="sm" className="gap-2">
            <span>&larr;</span>
            <span>Back to All Publications</span>
          </Button>
        </Link>
      </div>

      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900/60 sm:p-10">
        {/* Render standardized editorial header block feature primitive */}
        <ArticleHeaderBlock article={post} />

        {/* Article Monograph Body Content */}
        <div className="mt-8 prose prose-gray dark:prose-invert max-w-none">
          <p className="text-xs sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:text-blue-700 dark:first-letter:text-blue-400">
            {post.content || 'Archival publication body content processing.'}
          </p>
        </div>

        {/* Editorial Footer Acknowledgment Strip */}
        <footer className="mt-12 border-t border-gray-100 pt-6 dark:border-gray-800">
          <div className="rounded-2xl bg-gray-50 p-4 text-center dark:bg-gray-950/40">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
              Verified by the Okun Archival Peer Review Network • Access open repository datasets via civic protocols.
            </span>
          </div>
        </footer>
      </div>
    </article>
  );
}
