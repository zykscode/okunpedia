'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface AtlasMapViewerProps {
  initialRegion?: string;
  onSelectRegion?: (region: string) => void;
}

export const AtlasMapViewer = (props: AtlasMapViewerProps) => {
  const [activeLga, setActiveLga] = React.useState<string>(props.initialRegion || 'All Regions');

  const lgas = ['All Regions', 'Kabba/Bunu', 'Mopa-Muro', 'Ijumu', 'Yagba East', 'Yagba West', 'Oworo'];

  const handleSelect = (lga: string) => {
    setActiveLga(lga);
    if (props.onSelectRegion) {
      props.onSelectRegion(lga);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filtering control row */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Spatial Filter:
          </span>
          <Badge variant="amber">{activeLga}</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {lgas.map((lga) => (
            <Button
              key={lga}
              variant={activeLga === lga ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleSelect(lga)}
              className="text-[11px] rounded-lg"
            >
              {lga}
            </Button>
          ))}
        </div>
      </div>

      {/* Cinematic Static Preview Vector Bounding Canvas */}
      <div className="relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-950 p-8 text-center text-white shadow-xl dark:border-gray-800 sm:min-h-[500px]">
        {/* Soft grid background ambient textures */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Ambient Map Spotlights */}
        <div className="absolute top-1/4 left-1/4 size-80 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-80 rounded-full bg-amber-500/15 blur-3xl" />

        <div className="relative z-10 max-w-md">
          <span className="inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold tracking-widest text-amber-400 uppercase ring-1 ring-amber-500/20 backdrop-blur-xs">
            🗺️ Scalable Leaflet/MapLibre Engine
          </span>

          <h3 className="mt-4 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Interactive GIS Vector Atlas
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-slate-300 dark:text-gray-400 sm:text-sm">
            Displaying dynamic geospatial clusters, sub-group terrain demarcations, and adjacent boundary coordinates for the selected municipal target area:{' '}
            <span className="font-semibold text-white">{activeLga}</span>.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
              <span className="inline-block size-2 rounded-full bg-emerald-400" />
              <span>80+ Mapped Nodes</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-400">
              <span className="inline-block size-2 rounded-full bg-amber-400" />
              <span>Real-Time Proximity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
