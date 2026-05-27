import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'Interactive Okun Map — Coming Soon | Okunpedia',
  description:
    'The interactive geospatial atlas for Okun towns, boundary delineations, and cultural coordinates is coming soon.',
};

export default function InteractiveMapPage() {
  return (
    <ComingSoon
      featureName="Interactive GIS Atlas"
      title="Map Feature Coming Soon"
      message="We're building a full interactive geospatial atlas of Okunland — community boundaries, LGA territories, and cultural coordinates. Stay tuned."
    />
  );
}

