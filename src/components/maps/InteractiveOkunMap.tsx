'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from '@/libs/I18nNavigation';

type MapPoint = {
  id: string;
  name: string;
  lga: string;
  cx: number;
  cy: number;
  slug: string;
  tagline: string;
};

export const InteractiveOkunMap: React.FC = () => {
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);

  const points: MapPoint[] = [
    {
      id: '1',
      name: 'Kabba',
      lga: 'Kabba/Bunu',
      cx: 65,
      cy: 50,
      slug: 'kabba',
      tagline: 'Ancestral HQ & Monolith Site',
    },
    {
      id: '2',
      name: 'Mopa',
      lga: 'Mopa-Muro',
      cx: 45,
      cy: 38,
      slug: 'mopa',
      tagline: 'Intellectual Hub & Civic Self-Help',
    },
    {
      id: '3',
      name: 'Isanlu',
      lga: 'Yagba East',
      cx: 30,
      cy: 32,
      slug: 'isanlu',
      tagline: 'Cultural Junction & Agro-plains',
    },
    {
      id: '4',
      name: 'Egbe',
      lga: 'Yagba West',
      cx: 15,
      cy: 25,
      slug: 'egbe',
      tagline: 'Pioneer Missionary Healthcare Gateway',
    },
    {
      id: '5',
      name: 'Iyara',
      lga: 'Ijumu',
      cx: 55,
      cy: 62,
      slug: 'iyara',
      tagline: 'Municipal Literacy Hub',
    },
    {
      id: '6',
      name: 'Ekinrin-Adde',
      lga: 'Ijumu',
      cx: 62,
      cy: 68,
      slug: 'ekinrin-adde',
      tagline: 'Proactive Commercial Diaspora',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-b from-gray-950 to-gray-900 p-6 text-white shadow-2xl sm:p-8">
      {/* Top Map Header Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="amber" className="animate-pulse">
              Geospatial Explorer
            </Badge>
          </div>
          <h3 className="mt-2 font-serif text-xl font-bold tracking-tight text-white sm:text-2xl">
            Interactive Okun Belt Map
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">
            Select regional nodes below to load documented profiles
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="amber">Vector Topology Core</Badge>
          <Badge variant="emerald">Lineage Nodes Active</Badge>
        </div>
      </div>

      {/* SVG Canvas Map Simulation Layer */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-800/80 bg-gray-950 shadow-inner">
        {/* Ambient atmospheric backlights */}
        <div className="pointer-events-none absolute top-1/4 left-1/3 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />

        <svg className="size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Base topological boundary backdrop */}
          <path
            d="M 8 22 Q 25 10 45 12 T 85 28 Q 95 50 88 72 T 58 92 Q 30 85 15 75 Z"
            className="fill-gray-900/40 stroke-gray-800/60 stroke-[0.3]"
          />

          {/* Internal regional connectivity links */}
          <path
            d="M 15 25 L 30 32 L 45 38 L 65 50 L 55 62 L 62 68"
            className="stroke-dasharray-1 fill-none stroke-amber-500/20 stroke-[0.4]"
          />

          {/* Interactive Plot Points */}
          {points.map((p) => {
            const isActive = activePoint?.id === p.id;
            return (
              <g
                key={p.id}
                className="group cursor-pointer"
                onClick={() => {
                  setActivePoint(p);
                }}
              >
                {/* Outer radiating pulse rings */}
                {isActive ? (
                  <>
                    <circle
                      cx={p.cx}
                      cy={p.cy}
                      r="5"
                      className="animate-ping fill-amber-400 opacity-60"
                    />
                    <circle
                      cx={p.cx}
                      cy={p.cy}
                      r="3.5"
                      className="fill-amber-500/20 stroke-amber-400 stroke-[0.3]"
                    />
                  </>
                ) : (
                  <circle
                    cx={p.cx}
                    cy={p.cy}
                    r="3"
                    className="fill-emerald-500/10 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                )}

                {/* Marker Node Core */}
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={isActive ? '1.8' : '1.2'}
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'fill-amber-400 stroke-gray-950 stroke-[0.4]'
                      : 'fill-emerald-500 stroke-gray-900 stroke-[0.3] group-hover:scale-125 group-hover:fill-amber-300'
                  }`}
                />

                {/* Node Text Label */}
                <text
                  x={p.cx}
                  y={p.cy - 2.5}
                  textAnchor="middle"
                  className={`text-[2.8px] font-medium tracking-wide transition-colors select-none ${
                    isActive
                      ? 'fill-amber-300 font-bold'
                      : 'fill-gray-400 group-hover:fill-gray-200'
                  }`}
                >
                  {p.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Point Overlay Card Drawer */}
        {activePoint && (
          <div className="absolute right-4 bottom-4 left-4 rounded-2xl border border-gray-700/80 bg-gray-900/95 p-5 shadow-2xl backdrop-blur-md sm:right-4 sm:left-auto sm:max-w-sm">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
              <Badge variant="emerald">{activePoint.lga}</Badge>
              <button
                type="button"
                onClick={() => {
                  setActivePoint(null);
                }}
                className="flex size-6 items-center justify-center rounded-full bg-gray-800 text-xs text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                aria-label="Close Preview"
              >
                ✕
              </button>
            </div>

            <h4 className="mt-3 font-serif text-lg font-bold text-white">{activePoint.name}</h4>
            <p className="mt-1 text-xs font-medium text-amber-400">{activePoint.tagline}</p>
            <p className="mt-2 text-xs leading-relaxed text-gray-300">
              Verified spatial record synced with encyclopedic index. Source documentation updated
              natively.
            </p>

            <div className="mt-4 pt-2">
              <Link href={`/communities/${activePoint.slug}/`} className="block focus:outline-hidden">
                <Button variant="primary" size="sm" className="w-full">
                  <span>Read Full Chronicle</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
