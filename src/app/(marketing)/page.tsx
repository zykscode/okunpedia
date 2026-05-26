import type { Metadata } from 'next';
import { LandingPage } from './_landing/LandingPage';

import { AppConfig } from '@/utils/AppConfig';

export const metadata: Metadata = {
  title: 'Okunpedia — Encyclopedia of Okun Heritage, Culture & History',
  description:
    'The definitive digital encyclopedia documenting Okun traditional lineages, migration chronicles, community infrastructure, and cultural heritage across six local government areas in Kogi State.',
  openGraph: {
    title: 'Okunpedia — Encyclopedia of Okun Heritage, Culture & History',
    description:
      'The definitive digital encyclopedia documenting Okun traditional lineages, migration chronicles, community infrastructure, and cultural heritage across six local government areas in Kogi State.',
    url: AppConfig.siteUrl,
    siteName: AppConfig.title,
    images: [
      {
        url: `${AppConfig.siteUrl}/static/images/hero-bg.jpg`,
        width: 1200,
        height: 630,
        alt: 'Okunpedia Digital Heritage Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Okunpedia — Encyclopedia of Okun Heritage, Culture & History',
    description:
      'The definitive digital encyclopedia documenting Okun traditional lineages, migration chronicles, community infrastructure, and cultural heritage across six local government areas in Kogi State.',
    images: [`${AppConfig.siteUrl}/static/images/hero-bg.jpg`],
  },
};

export default function MarketingIndexPage() {
  return <LandingPage />;
}
