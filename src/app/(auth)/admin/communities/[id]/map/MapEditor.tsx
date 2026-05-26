'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { saveGisPolygonAction } from '../actions';

// Fix for default Leaflet icon paths in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type MapEditorProps = {
  townId: string;
  centerLat: number;
  centerLng: number;
  initialFeatureCollection: {
    type: string;
    features: Array<{
      type: string;
      geometry: {
        type: string;
        coordinates: number[][][];
      };
    }>;
  } | null;
};

// Event handler component for clicks on the Map
function MapEvents({ onMapClick }: { onMapClick: (latlng: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export function MapEditor(props: MapEditorProps) {
  // Extract initial polygon coordinates from GeoJSON if available
  const getInitialCoords = (): [number, number][] => {
    if (
      props.initialFeatureCollection?.features?.[0]?.geometry?.coordinates?.[0]
    ) {
      const coords = props.initialFeatureCollection.features[0].geometry.coordinates[0];
      // GeoJSON is [lng, lat], Leaflet wants [lat, lng]
      // Exclude the last coordinate if it matches the first (closed ring)
      const points = coords.map((c) => [c[1], c[0]] as [number, number]);
      const first = points[0];
      const last = points[points.length - 1];
      if (
        points.length > 1 &&
        first &&
        last &&
        first[0] === last[0] &&
        first[1] === last[1]
      ) {
        points.pop();
      }
      return points;
    }
    return [];
  };

  const [points, setPoints] = React.useState<[number, number][]>(getInitialCoords());
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleMapClick = (latlng: [number, number]) => {
    setPoints((prev) => [...prev, latlng]);
  };

  const handleUndo = () => {
    setPoints((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (confirm('Clear the current boundary polygon?')) {
      setPoints([]);
    }
  };

  const handleSave = () => {
    if (points.length < 3) {
      setError('A polygon must have at least 3 points.');
      return;
    }

    setError(null);
    setSuccess(null);

    const first = points[0];
    if (!first) return;

    // Convert to GeoJSON FeatureCollection: [lng, lat]
    const geoJsonCoords = [...points, first].map((p) => [p[1], p[0]]);
    const featureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [geoJsonCoords],
          },
        },
      ],
    };

    startTransition(async () => {
      const res = await saveGisPolygonAction(
        props.townId,
        featureCollection,
        props.centerLat,
        props.centerLng,
      );

      if (res.success) {
        setSuccess(res.message);
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {/* Sidebar Controls */}
      <div className="space-y-4 md:col-span-1">
        <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
          <h3 className="font-semibold text-gray-900 dark:text-white">Editor Controls</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Click on the map to define the boundary vertices of the community. Connect at least 3 points.
          </p>

          <div className="mt-4 space-y-2">
            <button
              onClick={handleUndo}
              disabled={points.length === 0}
              className="w-full rounded-xl border border-gray-200/80 bg-white py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900 disabled:opacity-50"
            >
              Undo Last Point
            </button>

            <button
              onClick={handleClear}
              disabled={points.length === 0}
              className="w-full rounded-xl border border-gray-200/80 bg-white py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:border-gray-800 dark:bg-gray-950 dark:text-rose-400 dark:hover:bg-rose-950/20 disabled:opacity-50"
            >
              Clear Boundary
            </button>

            <button
              onClick={handleSave}
              disabled={points.length < 3 || isPending}
              className="w-full rounded-xl bg-emerald-600 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save Boundary'}
            </button>
          </div>

          {error && <div className="mt-3 text-xs font-bold text-rose-500">{error}</div>}
          {success && <div className="mt-3 text-xs font-bold text-emerald-500">{success}</div>}
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
          <h4 className="text-xs font-bold text-gray-400 uppercase">Vertices ({points.length})</h4>
          <div className="mt-2 max-h-[200px] overflow-y-auto font-mono text-[10px] text-gray-500 dark:text-gray-400">
            {points.length === 0 ? (
              <span>No points added yet.</span>
            ) : (
              points.map((p, idx) => (
                <div key={idx} className="border-b border-gray-100 py-1 dark:border-gray-800/40">
                  {idx + 1}: {p[0].toFixed(5)}, {p[1].toFixed(5)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="h-[500px] md:col-span-3">
        <div className="h-full overflow-hidden rounded-2xl border border-gray-200/80 shadow-md dark:border-gray-800">
          <MapContainer
            center={[props.centerLat, props.centerLng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapEvents onMapClick={handleMapClick} />

            {/* Render the drawing/existing polygon */}
            {points.length > 0 && (
              <Polygon
                positions={points}
                pathOptions={{
                  color: '#10b981',
                  fillColor: '#34d399',
                  fillOpacity: 0.35,
                  weight: 3,
                }}
              />
            )}

            {/* Render markers for each vertex */}
            {points.map((p, idx) => (
              <Marker key={idx} position={p} />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
