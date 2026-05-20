import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export const metadata = {
  title: '404 — Page Not Found',
  description: 'The page you are looking for does not exist in the Okunpedia archive.',
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        {/* 404 number */}
        <div className="relative select-none">
          <span
            className="block font-serif text-[10rem] font-extrabold leading-none text-emerald-100 dark:text-emerald-950/60"
            aria-hidden="true"
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-5xl font-bold text-emerald-700 dark:text-emerald-400">
              404
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="mt-4 rounded-3xl border border-gray-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:border-gray-800/80 dark:bg-gray-900/60">
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
            Page not found in the archive
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            The article, community, or record you are looking for does not exist in the
            Okunpedia archive, or may have been moved to a different location.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus:outline-hidden dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
              <Home className="size-4" aria-hidden="true" />
              Back to home
            </Link>
            <Link
              href="/communities"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Search className="size-4" aria-hidden="true" />
              Browse communities
            </Link>
          </div>
        </div>

        {/* Decorative badge */}
        <p className="mt-6 text-xs text-gray-400 dark:text-gray-600">
          Okunpedia — Encyclopedia of Okun Land
        </p>
      </div>
    </div>
  );
}
