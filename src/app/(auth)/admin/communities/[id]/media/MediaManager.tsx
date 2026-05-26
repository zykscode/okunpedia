'use client';

import * as React from 'react';
import { useTransition } from 'react';
import Image from 'next/image';
import { deleteMediaAction } from '../actions';

type MediaItem = {
  id: string;
  url: string;
  caption: string | null;
  sizeBytes: number | null;
};

export function MediaManager(props: {
  townId: string;
  initialMedia: MediaItem[];
}) {
  const [media, setMedia] = React.useState<MediaItem[]>(props.initialMedia);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const captionInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('communityId', props.townId);
      formData.append('caption', captionInputRef.current?.value ?? '');

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Upload failed.');
      }

      setSuccess('Media uploaded successfully!');
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (captionInputRef.current) captionInputRef.current.value = '';

      setMedia((prev) => [data.media, ...prev]);
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await deleteMediaAction(props.townId, id);
      if (res.success) {
        setSuccess(res.message);
        setMedia((prev) => prev.filter((item) => item.id !== id));
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Upload Form */}
      <div className="md:col-span-1">
        <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
          <h3 className="font-semibold text-gray-900 dark:text-white">Upload New Media</h3>

          <form onSubmit={handleUpload} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase">Choose Image</label>
              <input
                type="file"
                ref={fileInputRef}
                required
                accept="image/*"
                className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-950/40 dark:file:text-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase">Caption</label>
              <input
                type="text"
                ref={captionInputRef}
                placeholder="e.g. Traditional Palace entrance"
                className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
            </div>

            {error && <div className="text-xs font-bold text-rose-500">{error}</div>}
            {success && <div className="text-xs font-bold text-emerald-500">{success}</div>}

            <button
              type="submit"
              disabled={isUploading || isPending}
              className="w-full rounded-xl bg-emerald-600 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </div>
      </div>

      {/* Gallery List */}
      <div className="md:col-span-2">
        <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
          <h3 className="font-semibold text-gray-900 dark:text-white">Media Gallery ({media.length})</h3>

          {media.length === 0 ? (
            <div className="mt-8 text-center text-sm text-gray-400">
              No media uploaded yet.
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {media.map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={item.url}
                      alt={item.caption || 'Community Media'}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-white/95 p-2 dark:bg-gray-950/95">
                    <p className="truncate text-xs font-medium text-gray-800 dark:text-gray-200">
                      {item.caption || 'No caption'}
                    </p>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                      className="mt-1 text-[10px] font-bold text-rose-600 hover:text-rose-700"
                    >
                      Remove
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
