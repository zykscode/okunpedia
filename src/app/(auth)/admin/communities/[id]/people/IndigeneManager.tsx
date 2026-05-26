'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { addIndigeneAction, deleteIndigeneAction } from '../actions';

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
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formRef = React.useRef<HTMLFormElement>(null);

  const handleAdd = async (formData: FormData) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await addIndigeneAction(props.townId, { success: false, message: '' }, formData);
      if (res.success) {
        setSuccess(res.message);
        formRef.current?.reset();
        // Optimistically update list by appending the new indigene
        // In a real app we'd fetch the updated list or return the new record
        // Here we just reload or push a placeholder since it's revalidated on the server
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
          <h3 className="font-semibold text-gray-900 dark:text-white">Add Indigene</h3>

          <form ref={formRef} action={handleAdd} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase">Full Name</label>
              <input
                type="text"
                name="name"
                required
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
                placeholder="Describe their achievements, background, and contribution to the community..."
                className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
            </div>

            {error && <div className="text-xs font-bold text-rose-500">{error}</div>}
            {success && <div className="text-xs font-bold text-emerald-500">{success}</div>}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-emerald-600 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 disabled:opacity-50"
            >
              {isPending ? 'Adding...' : 'Add Record'}
            </button>
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
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending}
                    className="rounded-lg p-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
