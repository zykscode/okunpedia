import { InteractiveOkunMap } from '@/components/maps/InteractiveOkunMap';

import { AppConfig } from '@/utils/AppConfig';

export const metadata = {
  title: 'Interactive Okun Map — Digital Geospatial Atlas | Okunpedia',
  description:
    'Navigate visually through all documented Okun towns, traditional boundary delineations, and cultural geographical coordinates.',
  openGraph: {
    title: 'Interactive Okun Map — Digital Geospatial Atlas',
    description:
      'Navigate visually through all documented Okun towns, traditional boundary delineations, and cultural geographical coordinates.',
    url: `${AppConfig.siteUrl}/map`,
    siteName: AppConfig.title,
    images: [
      {
        url: `${AppConfig.siteUrl}/static/images/hero-bg.jpg`,
        width: 1200,
        height: 630,
        alt: 'Interactive Okun Map',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Okun Map — Digital Geospatial Atlas',
    description:
      'Navigate visually through all documented Okun towns, traditional boundary delineations, and cultural geographical coordinates.',
    images: [`${AppConfig.siteUrl}/static/images/hero-bg.jpg`],
  },
};

export default function InteractiveMapPage() {
  return (
    <div className="mx-auto max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
          Interactive Geographic System
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Visualizing municipal borders, physical infrastructure distributions, and ancestral boundaries.
        </p>
      </div>

      <InteractiveOkunMap />
    </div>
  );
}
