import type { Metadata } from 'next';
import { Sponsors } from '@/components/Sponsors';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from '@/libs/I18nNavigation';

export const metadata: Metadata = {
  title: 'Okunpedia Heritage - Cinematic Tribal Encyclopedia & Atlas',
  description:
    'The premier digital cultural ecosystem documenting Okun traditional lineages, migration chronicles, municipal infrastructure nodes, and dialect matrices.',
};

export default function MarketingIndexPage() {
  return (
    <div className="space-y-16 py-4">
      {/* Cinematic Ambient Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-gray-900 to-amber-950 p-8 text-white shadow-2xl transition-all duration-300 dark:from-gray-950 dark:via-black dark:to-emerald-950 sm:p-12 lg:p-20">
        {/* Apple-style floating ambient micro-surfaces */}
        <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5" />
        <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-500/5" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Top Curated Accent Badge */}
          <div className="inline-flex items-center gap-2">
            <Badge variant="amber" className="px-3 py-1 text-xs backdrop-blur-xs">
              <span className="flex size-1.5 animate-pulse rounded-full bg-amber-400" />
              Digital Archival Platform
            </Badge>
          </div>

          {/* Premium Heading Typography */}
          <h1 className="mt-6 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
            Preserving the Oral History & Lineages of Okunland
          </h1>

          {/* Subtitle */}
          <p className="mt-6 mx-auto max-w-2xl text-xs leading-relaxed text-slate-300 dark:text-gray-400 sm:text-base lg:text-lg">
            Explore dedicated community profiles, traditional monarchy structures, migration narratives, and active infrastructural development nodes across the six local government areas.
          </p>

          {/* Interactive Routing Control Bar */}
          <div className="mt-10">
            <form
              action="/communities/"
              method="GET"
              className="mx-auto flex max-w-xl items-center gap-2 rounded-xl bg-white/10 p-1.5 backdrop-blur-md focus-within:ring-2 focus-within:ring-amber-400 dark:bg-white/5"
            >
              <input
                type="text"
                name="search"
                placeholder="Search community registry, traditional titles, or leaders..."
                className="w-full bg-transparent px-4 py-2 text-xs text-white placeholder-gray-400 focus:outline-hidden sm:text-sm"
              />
              <Button type="submit" variant="primary" size="md" className="shrink-0">
                Explore Registry
              </Button>
            </form>

            {/* Micro-Navigation Suggestions */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
              <span>Popular hubs:</span>
              {['Kabba', 'Isanlu', 'Mopa', 'Egbe', 'Iyara', 'Ekinrin-Adde'].map((town) => (
                <Link
                  key={town}
                  href={`/communities/${town.toLowerCase()}/`}
                  className="rounded-md bg-white/5 px-2 py-0.5 font-medium transition-colors hover:bg-white/20 hover:text-white dark:bg-white/5 dark:hover:bg-white/10"
                >
                  {town}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Municipal Statistics Matrix */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
        {[
          {
            val: '6 Core',
            label: 'Local Government Areas',
            color: 'from-emerald-500 to-emerald-700',
          },
          {
            val: '80+ Nodes',
            label: 'Documented Communities',
            color: 'from-amber-500 to-amber-700',
          },
          {
            val: 'Paramount',
            label: 'Traditional Monarchies',
            color: 'from-blue-500 to-indigo-700',
          },
          {
            val: 'Centuries',
            label: 'Migration Narratives',
            color: 'from-purple-500 to-pink-700',
          },
        ].map((stat, idx) => (
          <div
            key={String(idx)}
            className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60"
          >
            <div className={`mx-auto mb-3 h-1 w-12 rounded-full bg-gradient-to-r ${stat.color}`} />
            <div className="font-serif text-3xl font-bold tracking-tight text-gray-900 transition-colors dark:text-white sm:text-4xl">
              {stat.val}
            </div>
            <div className="mt-1.5 text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 sm:text-sm">
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* Premium Platform Suites Grid */}
      <section className="grid gap-6 md:grid-cols-3">
        {/* Zone 1: Encyclopedia */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-emerald-500/30">
          <div>
            <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600 ring-1 ring-emerald-600/10 transition-colors ring-inset group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-500/20 dark:group-hover:bg-emerald-500 dark:group-hover:text-gray-950">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
              Community Encyclopedia
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
              In-depth local documentation spanning founding folklore, clan boundaries, prominent leadership, and active local amenity statuses.
            </p>
          </div>
          <div className="mt-6 pt-2">
            <Link href="/communities/" className="block focus:outline-hidden">
              <Button variant="outline" size="sm" className="w-full group-hover:border-emerald-500/40">
                <span>Browse Registry Directory</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Zone 2: GIS Mapping Engine */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-amber-500/30">
          <div>
            <div className="mb-4 inline-flex rounded-xl bg-amber-50 p-3 text-amber-600 ring-1 ring-amber-600/10 transition-colors ring-inset group-hover:bg-amber-600 group-hover:text-white dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-500/20 dark:group-hover:bg-amber-500 dark:group-hover:text-gray-950">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900 transition-colors group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400">
              Interactive GIS Map
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
              Geospatial explorer charting indigenous terrain boundaries, active district coordinates, and visual proximity maps.
            </p>
          </div>
          <div className="mt-6 pt-2">
            <Link href="/map/" className="block focus:outline-hidden">
              <Button variant="outline" size="sm" className="w-full group-hover:border-amber-500/40">
                <span>Launch Atlas Engine</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Zone 3: Editorial Desk */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-blue-500/30">
          <div>
            <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600 ring-1 ring-blue-600/10 transition-colors ring-inset group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-500/20 dark:group-hover:bg-blue-500 dark:group-hover:text-gray-950">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
              Publications & News
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
              Archival updates covering community outreach digests, heritage symposiums, and curated civic tech announcements.
            </p>
          </div>
          <div className="mt-6 pt-2">
            <Link href="/blog/" className="block focus:outline-hidden">
              <Button variant="outline" size="sm" className="w-full group-hover:border-blue-500/40">
                <span>Review Dispatch Feed</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Global Sponsors Section */}
      <section className="border-t border-gray-200/80 pt-10 dark:border-gray-800">
        <h2 className="text-center font-serif text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
          Supported Patrons & Technical Collaborators
        </h2>
        <div className="mt-8">
          <Sponsors />
        </div>
      </section>
    </div>
  );
}
