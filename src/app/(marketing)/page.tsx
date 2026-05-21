import type { Metadata } from 'next';
import { LandingPage } from './_landing/LandingPage';

export const metadata: Metadata = {
  title: 'Okunpedia — Encyclopedia of Okun Heritage, Culture & History',
  description:
    'The definitive digital encyclopedia documenting Okun traditional lineages, migration chronicles, community infrastructure, and cultural heritage across six local government areas in Kogi State.',
};

export default function MarketingIndexPage() {
  return <LandingPage />;
}
