'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { addRulerAction, deleteRulerAction, updateRulerAction } from '../actions';

type Ruler = {
  id: number;
  title: string;
  name: string;
  reignStart: string | null;
  reignEnd: string | null;
  isIncumbent: boolean | null;
};

export function RulerManager(props: {
  townId: string;
  initialRulers: Ruler[];
}) {
  const [rulers, setRulers] = React.useState<Ruler[]>(props.initialRulers);
  const [editingItem, setEditingItem] = React.useState<Ruler | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = editingItem
        ? await updateRulerAction(props.townId, editingItem.id, { success: false, message: '' }, formData)
        : await addRulerAction(props.townId, { success: false, message: '' }, formData);
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
    if (!confirm('Are you sure you want to remove this ruler?')) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await deleteRulerAction(props.townId, id);
      if (res.success) {
        setSuccess(res.message);
        setRulers((prev) => prev.filter((item) => item.id !== id));
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
            {editingItem ? 'Edit Ruler' : 'Add Ruler'}
          </h3>

          <form
            key={editingItem ? editingItem.id : 'new'}
            ref={formRef}
            action={handleSubmit}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase">Title</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={editingItem?.title ?? ''}
                placeholder="e.g. Obaro, Elulu, Olubunu"
                className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase">Name</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={editingItem?.name ?? ''}
                placeholder="e.g. Oba Festus Awoniyi"
                className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Reign Start</label>
                <input
                  type="text"
                  name="reignStart"
                  defaultValue={editingItem?.reignStart ?? ''}
                  placeholder="e.g. 1995"
                  className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Reign End</label>
                <input
                  type="text"
                  name="reignEnd"
                  defaultValue={editingItem?.reignEnd ?? ''}
                  placeholder="e.g. Present"
                  className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase">Incumbent?</label>
              <select
                name="isIncumbent"
                defaultValue={editingItem ? String(editingItem.isIncumbent) : 'false'}
                className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              >
                <option value="false">Past Ruler</option>
                <option value="true">Current Incumbent</option>
              </select>
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
                {isPending ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Ruler'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* List Card */}
      <div className="md:col-span-2">
        <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
          <h3 className="font-semibold text-gray-900 dark:text-white">Ruler Lineage ({rulers.length})</h3>

          {rulers.length === 0 ? (
            <div className="mt-8 text-center text-sm text-gray-400">
              No lineage records documented yet.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-500 dark:text-gray-400">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-bold text-gray-400 uppercase dark:border-gray-800">
                    <th className="py-2.5">Title</th>
                    <th className="py-2.5">Name</th>
                    <th className="py-2.5">Reign</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                  {rulers.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                      <td className="py-3 font-semibold text-gray-900 dark:text-white">{item.title}</td>
                      <td className="py-3">{item.name}</td>
                      <td className="py-3">
                        {item.reignStart ?? '—'} - {item.reignEnd ?? '—'}
                      </td>
                      <td className="py-3">
                        {item.isIncumbent ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            Incumbent
                          </span>
                        ) : (
                          <span className="text-gray-400">Past</span>
                        )}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
