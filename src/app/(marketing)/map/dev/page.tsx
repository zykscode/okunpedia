/**
 * DEV-ONLY sandbox for the interactive map feature.
 *
 * This route is intentionally NOT linked from any public navigation.
 * Access it directly at /map/dev during local development.
 *
 * When the map feature is ready for production:
 * 1. Move / copy the implementation here into /map/page.tsx
 * 2. Delete this file (or keep it as a scratchpad)
 */
import type { Metadata } from 'next';
import { AtlasMapViewer } from '@/features/maps/AtlasMapViewer';

export const metadata: Metadata = {
  title: '[DEV] Map Sandbox — Okunpedia',
  // Prevent search engines from indexing this dev route
  robots: { index: false, follow: false },
};

export default function MapDevPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 py-8">
      {/* Dev banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 dark:border-amber-800/50 dark:bg-amber-950/20">
        <span className="text-lg">🛠️</span>
        <div>
          <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
            Development Sandbox — not linked publicly
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Build and test the map feature here. The public <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/40">/map</code> route shows a Coming Soon page.
          </p>
        </div>
      </div>

      <div>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          Interactive GIS Atlas
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Visualising municipal borders, infrastructure distributions, and ancestral boundaries.
        </p>
      </div>

      <AtlasMapViewer />
    </div>
  );
}
