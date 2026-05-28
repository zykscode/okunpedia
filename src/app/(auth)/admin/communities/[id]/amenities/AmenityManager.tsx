'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { addAmenityAction, deleteAmenityAction, updateAmenityAction } from '../actions';

type Amenity = {
  id: number;
  category: string;
  name: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
};

const CATEGORIES = [
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'road', label: 'Road / Transport' },
  { value: 'water', label: 'Water' },
  { value: 'power', label: 'Power / Grid' },
  { value: 'market', label: 'Market / Trade' },
  { value: 'security', label: 'Security' },
];

const STATUSES = [
  { value: 'functional', label: 'Functional', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
  { value: 'dilapidated', label: 'Dilapidated', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' },
  { value: 'under_construction', label: 'Under Construction', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' },
  { value: 'abandoned', label: 'Abandoned', badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' },
];

export function AmenityManager(props: {
  townId: string;
  initialAmenities: Amenity[];
}) {
  const [amenities, setAmenities] = React.useState<Amenity[]>(props.initialAmenities);
  const [editingItem, setEditingItem] = React.useState<Amenity | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = editingItem
        ? await updateAmenityAction(props.townId, editingItem.id, { success: false, message: '' }, formData)
        : await addAmenityAction(props.townId, { success: false, message: '' }, formData);
      if (res.success) {
        setSuccess(res.message);
        formRef.current?.reset();
        setEditingItem(null);
        window.location.reload();
      } else {
        setError(res.message);
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this amenity?')) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await deleteAmenityAction(props.townId, id);
      if (res.success) {
        setSuccess(res.message);
        setAmenities((prev) => prev.filter((item) => item.id !== id));
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Form Card */}
      <div className="md:col-span-1">
        <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {editingItem ? 'Edit Infrastructure' : 'Add Infrastructure'}
          </h3>

          <form
            key={editingItem ? editingItem.id : 'new'}
            ref={formRef}
            action={handleSubmit}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase">Category</label>
              <select
                name="category"
                required
                defaultValue={editingItem?.category ?? 'education'}
                className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase">Facility Name</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={editingItem?.name ?? ''}
                placeholder="e.g. Bunu Community Secondary School"
                className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase">Current Status</label>
              <select
                name="status"
                required
                defaultValue={editingItem?.status ?? 'functional'}
                className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Latitude (Optional)</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  defaultValue={editingItem?.latitude ?? ''}
                  placeholder="e.g. 7.782"
                  className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Longitude (Optional)</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  defaultValue={editingItem?.longitude ?? ''}
                  placeholder="e.g. 6.239"
                  className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                />
              </div>
            </div>

            {error && <div className="text-xs font-bold text-rose-500">{error}</div>}
            {success && <div className="text-xs font-bold text-emerald-500">{success}</div>}

            <div className="flex gap-2">
              {editingItem && (
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="w-1/3 rounded-xl border border-gray-200/80 py-2 text-sm font-bold text-gray-700 dark:border-gray-800 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isPending}
                className={`rounded-xl py-2 text-sm font-bold text-white shadow-md transition-all disabled:opacity-50 cursor-pointer ${
                  editingItem ? 'w-2/3 bg-blue-600 hover:bg-blue-700' : 'w-full bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isPending ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Amenity'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* List Card */}
      <div className="md:col-span-2">
        <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
          <h3 className="font-semibold text-gray-900 dark:text-white">Documented Infrastructure ({amenities.length})</h3>

          {amenities.length === 0 ? (
            <div className="mt-8 text-center text-sm text-gray-400">
              No amenities or infrastructure documented yet.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-500 dark:text-gray-400">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-bold text-gray-400 uppercase dark:border-gray-800">
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5">Name</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5">GPS Coords</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                  {amenities.map((item) => {
                    const catObj = CATEGORIES.find((c) => c.value === item.category);
                    const statusObj = STATUSES.find((s) => s.value === item.status);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                        <td className="py-3 font-semibold text-gray-900 dark:text-white capitalize">
                          {catObj?.label ?? item.category}
                        </td>
                        <td className="py-3">{item.name}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            statusObj?.badge ?? 'bg-gray-100 text-gray-700'
                          }`}>
                            {statusObj?.label ?? item.status}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-xs">
                          {item.latitude !== null && item.longitude !== null
                            ? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`
                            : '—'}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="rounded-lg px-2 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/20 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={isPending}
                              className="rounded-lg px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
