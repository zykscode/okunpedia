'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft } from 'lucide-react';
import { updateTownAction } from '@/app/(auth)/admin/actions';

type Town = {
  id: string;
  name: string;
  tagline: string | null;
  overview: string;
  rulerTitle: string | null;
  traditionalRuler: string | null;
  published: boolean;
  lgaName: string | null;
};

export function EditTownForm(props: { town: Town }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setMessage(null);

    startTransition(async () => {
      const res = await updateTownAction(props.town.id, { success: false, message: '' }, formData);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            message.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-400'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
        <div className="space-y-5 p-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-bold tracking-wider text-gray-600 uppercase dark:text-gray-400">
              Community Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={props.town.name}
              required
              disabled={isPending}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
            />
          </div>

          {/* Tagline */}
          <div>
            <label htmlFor="tagline" className="mb-1.5 block text-xs font-bold tracking-wider text-gray-600 uppercase dark:text-gray-400">
              Tagline / District or Clan
            </label>
            <input
              id="tagline"
              name="tagline"
              type="text"
              defaultValue={props.town.tagline ?? ''}
              disabled={isPending}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
            />
          </div>

          {/* Overview */}
          <div>
            <label htmlFor="overview" className="mb-1.5 block text-xs font-bold tracking-wider text-gray-600 uppercase dark:text-gray-400">
              Historical Overview *
            </label>
            <textarea
              id="overview"
              name="overview"
              rows={8}
              defaultValue={props.town.overview}
              required
              disabled={isPending}
              className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
            />
          </div>

          {/* Ruler info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rulerTitle" className="mb-1.5 block text-xs font-bold tracking-wider text-gray-600 uppercase dark:text-gray-400">
                Ruler Title
              </label>
              <input
                id="rulerTitle"
                name="rulerTitle"
                type="text"
                defaultValue={props.town.rulerTitle ?? ''}
                disabled={isPending}
                placeholder="e.g. Obaro, Elulu"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="traditionalRuler" className="mb-1.5 block text-xs font-bold tracking-wider text-gray-600 uppercase dark:text-gray-400">
                Traditional Ruler
              </label>
              <input
                id="traditionalRuler"
                name="traditionalRuler"
                type="text"
                defaultValue={props.town.traditionalRuler ?? ''}
                disabled={isPending}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
              />
            </div>
          </div>

          {/* Published toggle */}
          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/30">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Published</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Visible to the public on the communities page</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="published"
                value="true"
                defaultChecked={props.town.published}
                disabled={isPending}
                className="peer sr-only"
                onChange={(e) => {
                  const hiddenInput = e.currentTarget.form?.querySelector('input[name="published"][type="hidden"]');
                  if (hiddenInput instanceof HTMLInputElement) {
                    hiddenInput.value = e.currentTarget.checked ? 'true' : 'false';
                  }
                }}
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-5 dark:bg-gray-700" />
            </label>
            <input type="hidden" name="published" value={props.town.published ? 'true' : 'false'} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/40">
          <Link
            href="/admin/communities"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Communities
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? (
              <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <Save className="size-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}
