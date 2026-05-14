import { Link } from '@/libs/I18nNavigation';

export const DemoBanner = () => (
  <div className="sticky top-0 z-50 border-b border-amber-500/20 bg-gradient-to-r from-amber-950 via-gray-900 to-emerald-950 px-4 py-2.5 text-center text-xs font-medium tracking-wide text-gray-200 sm:text-sm">
    <span className="mr-2 inline-flex items-center rounded-full bg-amber-500/20 px-2.5 py-0.5 text-amber-300 ring-1 ring-amber-500/30">
      ✨ Okunland Heritage
    </span>
    <span>
      The definitive digital encyclopedia documenting traditional monarchies and regional
      communities.
    </span>{' '}
    <Link
      href="/communities/"
      className="ml-1 inline-flex items-center font-bold text-emerald-400 underline decoration-emerald-400/50 underline-offset-2 hover:text-emerald-300"
    >
      Explore Atlas &rarr;
    </Link>
  </div>
);
