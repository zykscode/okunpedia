'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { addIndigeneAction, deleteIndigeneAction, updateIndigeneAction } from '../actions';

type Indigene = {
  id: number;
  name: string;
  biography: string;
};

export function IndigeneManager(props: {
  townId: string;
  initialIndigenes: Indigene[];
}) {
  const [indigenes, setIndigenes] = React.useState<Indigene[]>(props.initialIndigenes);
  const [editingItem, setEditingItem] = React.useState<Indigene | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = editingItem
        ? await updateIndigeneAction(props.townId, editingItem.id, { success: false, message: '' }, formData)
        : await addIndigeneAction(props.townId, { success: false, message: '' }, formData);
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
    if (!confirm('Are you sure you want to remove this indigene?')) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await deleteIndigeneAction(props.townId, id);
      if (res.success) {
        setSuccess(res.message);
        setIndigenes((prev) => prev.filter((item) => item.id !== id));
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
            {editingItem ? 'Edit Indigene' : 'Add Indigene'}
          </h3>

          <form
            key={editingItem ? editingItem.id : 'new'}
            ref={formRef}
            action={handleSubmit}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase">Full Name</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={editingItem?.name ?? ''}
                placeholder="e.g. Chief Sunday Awoniyi"
                className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase">Short Biography</label>
              <textarea
                name="biography"
                required
                rows={4}
                defaultValue={editingItem?.biography ?? ''}
                placeholder="Describe their achievements, background, and contribution to the community..."
                className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
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
                {isPending ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Record'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* List Card */}
      <div className="md:col-span-2">
        <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
          <h3 className="font-semibold text-gray-900 dark:text-white">Documented Indigenes ({indigenes.length})</h3>

          {indigenes.length === 0 ? (
            <div className="mt-8 text-center text-sm text-gray-400">
              No prominent indigenes documented yet.
            </div>
          ) : (
            <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
              {indigenes.map((item) => (
                <div key={item.id} className="flex items-start justify-between py-3">
                  <div className="space-y-1 pr-4">
                    <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                      {item.biography}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="rounded-lg p-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/20 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                      className="rounded-lg p-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
