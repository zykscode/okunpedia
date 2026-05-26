'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { updateCommunitySectionsAction } from '../actions';

type SectionsData = {
  historicalBackground: string;
  foundingStories: string;
  cultureAndTraditions: string;
};

export function SectionsEditor(props: {
  townId: string;
  initialData: SectionsData;
}) {
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateCommunitySectionsAction(props.townId, { success: false, message: '' }, formData);
      if (res.success) {
        setSuccess(res.message);
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50 space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Historical Background</label>
          <textarea
            name="historicalBackground"
            rows={6}
            defaultValue={props.initialData.historicalBackground}
            placeholder="Detailed narrative about the community's establishment, historical progression, and notable milestones..."
            className="mt-1.5 w-full rounded-xl border border-gray-200/80 bg-white px-4 py-3 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Founding Stories & Mythologies</label>
          <textarea
            name="foundingStories"
            rows={6}
            defaultValue={props.initialData.foundingStories}
            placeholder="Oral history, myths of origin, early founders, migrations, and legendary tales of how the settlement started..."
            className="mt-1.5 w-full rounded-xl border border-gray-200/80 bg-white px-4 py-3 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Culture, Traditions & Festivals</label>
          <textarea
            name="cultureAndTraditions"
            rows={6}
            defaultValue={props.initialData.cultureAndTraditions}
            placeholder="Document cultural heritage, traditional festivals, ceremonies, dialects spoken, local customs, and social norms..."
            className="mt-1.5 w-full rounded-xl border border-gray-200/80 bg-white px-4 py-3 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
          />
        </div>

        {error && <div className="text-sm font-bold text-rose-500">{error}</div>}
        {success && <div className="text-sm font-bold text-emerald-500">{success}</div>}

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800/60">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 disabled:opacity-50"
          >
            {isPending ? 'Saving Sections...' : 'Save Sections'}
          </button>
        </div>
      </div>
    </form>
  );
}
