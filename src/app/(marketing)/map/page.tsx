import { InteractiveOkunMap } from '@/components/maps/InteractiveOkunMap';

export const metadata = {
  title: 'Interactive Okun Map - Digital Geospatial Atlas',
  description:
    'Navigate visually through all documented Okun towns, traditional boundary delineations, and cultural geographical coordinates.',
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
