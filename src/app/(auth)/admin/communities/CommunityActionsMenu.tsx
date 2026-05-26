'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Globe, EyeOff, Trash2 } from 'lucide-react';
import { toggleTownPublishedAction, deleteTownAction } from '../actions';

type Props = {
  townId: string;
  published: boolean;
};

export function CommunityActionsMenu(props: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    setOpen(false);
    startTransition(async () => {
      await toggleTownPublishedAction(props.townId, !props.published);
      router.refresh();
    });
  };

  const handleDelete = () => {
    setOpen(false);
    if (!confirm('Permanently delete this community? This cannot be undone.')) return;
    startTransition(async () => {
      await deleteTownAction(props.townId);
      router.refresh();
    });
  };

  return (
    <div className="relative">
      <button
        id={`community-menu-${props.townId}`}
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-xs transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        aria-label="Community actions"
      >
        <MoreHorizontal className="size-4" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <button
              onClick={handleToggle}
              className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {props.published ? (
                <>
                  <EyeOff className="size-4 text-amber-500" />
                  Unpublish
                </>
              ) : (
                <>
                  <Globe className="size-4 text-emerald-500" />
                  Publish
                </>
              )}
            </button>
            <div className="border-t border-gray-100 dark:border-gray-800" />
            <button
              onClick={handleDelete}
              className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              <Trash2 className="size-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
