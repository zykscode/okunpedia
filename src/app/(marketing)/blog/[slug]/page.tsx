import { allBlogs } from 'contentlayer/generated';
// oxlint-disable require-await
// oxlint-disable typescript/no-unsafe-type-assertion
import { notFound } from 'next/navigation';
import { MDXRenderer } from '@/components/blog/MDXRenderer';
import { Button } from '@/components/ui/Button';
import { ArticleHeaderBlock } from '@/features/editorial/ArticleHeaderBlock';
import { Link } from '@/libs/I18nNavigation';
import { AppConfig } from '@/utils/AppConfig';

type BlogDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return allBlogs.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props: BlogDetailProps) {
  const params = await props.params;
  const slug = params.slug;

  const post = allBlogs.find((p) => p.slug === slug);
  const title = post ? post.title : slug.replace(/-/g, ' ');
  const cleanTitle = `${title} — Okunpedia Dispatch`;
  const description =
    post?.summary ||
    `Official peer-reviewed archival publication addressing ${title} across Okun municipal districts.`;
  const image =
    post?.images && post.images.length > 0
      ? post.images[0]
      : `${AppConfig.siteUrl}/static/images/hero-bg.jpg`;

  return {
    title: cleanTitle,
    description,
    openGraph: {
      title: cleanTitle,
      description,
      type: 'article',
      url: `${AppConfig.siteUrl}/blog/${slug}`,
      siteName: AppConfig.title,
      images: [
        {
          url: image,
          alt: title,
        },
      ],
      publishedTime: post ? post.date : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description,
      images: [image],
    },
  };
}

export default async function BlogDetailPage(props: BlogDetailProps) {
  const params = await props.params;
  const slug = params.slug;

  const post = allBlogs.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const mappedPost = {
    title: post.title,
    category: post.tags && post.tags.length > 0 ? post.tags[0] : 'culture',
    publishedAt: new Date(post.date),
  };

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

      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-10 dark:border-gray-800 dark:bg-gray-900/60">
        {/* Render standardized editorial header block feature primitive */}
        <ArticleHeaderBlock article={mappedPost as any} />

        {/* Article Monograph Body Content */}
        <div className="prose mt-8 max-w-none prose-emerald dark:prose-invert prose-headings:font-serif">
          <MDXRenderer code={post.body.code} />
        </div>

        {/* Editorial Footer Acknowledgment Strip */}
        <footer className="mt-12 border-t border-gray-100 pt-6 dark:border-gray-800">
          <div className="rounded-2xl bg-gray-50 p-4 text-center dark:bg-gray-950/40">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
              Verified by the Okun Archival Peer Review Network • Access open repository datasets
              via civic protocols.
            </span>
          </div>
        </footer>
      </div>
    </article>
  );
}
