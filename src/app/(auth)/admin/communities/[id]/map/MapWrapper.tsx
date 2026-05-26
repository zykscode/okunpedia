'use client';

import dynamic from 'next/dynamic';

const MapEditor = dynamic(() => import('./MapEditor').then((mod) => mod.MapEditor), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-2xl border border-gray-200/80 bg-white/70 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
      <span className="text-sm font-semibold text-gray-500">Loading Map Editor...</span>
    </div>
  ),
});

export function MapWrapper(props: {
  townId: string;
  centerLat: number;
  centerLng: number;
  initialFeatureCollection: any;
}) {
  return <MapEditor {...props} />;
}
