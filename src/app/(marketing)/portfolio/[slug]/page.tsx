import type { Metadata } from 'next';
import Image from 'next/image';
import codeRabbitLogo from '@/public/assets/images/coderabbit-logo-light.svg';

type PortfolioDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Array.from({ length: 6 }, (_, i) => ({
    slug: `${i}`,
  }));
}

import { AppConfig } from '@/utils/AppConfig';

export async function generateMetadata(props: PortfolioDetailPageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  const title = `Visual Showcase #${Number(slug) + 1} — Archival Capture | Okunpedia`;
  const description = `Detailed visual record showcase collection index #${slug} documenting regional architecture and topographical boundaries of Okunland.`;
  const image = `${AppConfig.siteUrl}/static/images/hero-bg.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${AppConfig.siteUrl}/portfolio/${slug}`,
      siteName: AppConfig.title,
      images: [
        {
          url: image,
          alt: `Visual Capture #${slug}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function PortfolioDetail(props: PortfolioDetailPageProps) {
  const params = await props.params;
  const slug = params.slug;

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-gray-900">
          Visual Artifact Capture #{Number(slug) + 1}
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Catalog node entry reference: CODE-{slug}
        </p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-sm text-gray-700">
        <p>
          This dedicated showcase holds synchronized high-resolution captures detailing paramount physical structures, traditional monolith boundaries, and community historical assets aligned with the municipal archive.
        </p>
      </div>

      <div className="mt-10 border-t border-gray-100 pt-6 text-center text-sm">
        Code review optimization powered by{' '}
        <a
          className="text-blue-700 hover:border-b-2 hover:border-blue-700"
          href="https://www.coderabbit.ai?utm_source=next_js_starter&utm_medium=github&utm_campaign=next_js_starter_oss_2025"
        >
          CodeRabbit
        </a>
      </div>

      <a href="https://www.coderabbit.ai?utm_source=next_js_starter&utm_medium=github&utm_campaign=next_js_starter_oss_2025">
        <Image className="mx-auto mt-2" src={codeRabbitLogo} alt="CodeRabbit" width={130} />
      </a>
    </div>
  );
}

export const dynamicParams = false;
