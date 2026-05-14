import { db } from '@/libs/DB';
import { Link } from '@/libs/I18nNavigation';
import { communitiesSchema } from '@/models/Schema';
import { Button } from '@/components/ui/Button';
import { CommunityProfileCard } from '@/features/communities/CommunityProfileCard';

export const metadata = {
  title: 'Okun Communities Index - Explore Traditional Towns & Lineages',
  description:
    'Comprehensive repository listing documented local governance hubs, core traditional clans, historical migration archives, and local civic metrics across Okunland.',
};

export default async function CommunitiesPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const rawSearch = typeof searchParams.search === 'string' ? searchParams.search : '';
  const query = rawSearch.toLowerCase().trim();

  // Query database records using Drizzle ORM securely with fallback resilience
  let communities: Array<typeof communitiesSchema.$inferSelect> = [];
  try {
    communities = await db.select().from(communitiesSchema);
  } catch {
    // Fall back gracefully if local table is missing or un-migrated
    communities = [];
  }

  // Pre-seed offline static preview states if local database is empty
  const baseList =
    communities.length > 0
      ? communities
      : [
          {
            id: 1,
            name: 'Kabba (Owe)',
            slug: 'kabba',
            lga: 'Kabba/Bunu',
            districtOrClan: 'Owe Clan',
            historicalBackground:
              'The ancestral headquarters of the Okun people, historically famous for traditional weaving, sacred monolith structures, and serving as the provincial capital during the colonial administration.',
          },
          {
            id: 2,
            name: 'Mopa',
            slug: 'mopa',
            lga: 'Mopa-Muro',
            districtOrClan: 'Mopa Clan',
            historicalBackground:
              'Known as the intellectual hub of the Mopa-Muro local government area, home to renowned educational foundations and prominent indigenes contributing deeply to national development.',
          },
          {
            id: 3,
            name: 'Isanlu',
            slug: 'isanlu',
            lga: 'Yagba East',
            districtOrClan: 'Yagba Clan',
            historicalBackground:
              'A major trading junction and municipal center within the Yagba belt, characterized by vibrant historical festivals and rich agricultural output.',
          },
          {
            id: 4,
            name: 'Egbe',
            slug: 'egbe',
            lga: 'Yagba West',
            districtOrClan: 'Yagba Clan',
            historicalBackground:
              'Famous for housing the oldest pioneer missionary healthcare institutions in the region and bordered by iconic high-altitude topographical landmarks.',
          },
          {
            id: 5,
            name: 'Iyara',
            slug: 'iyara',
            lga: 'Ijumu',
            districtOrClan: 'Ijumu Clan',
            historicalBackground:
              'The administrative capital of Ijumu local government area, celebrated for vibrant cultural expressions, high literacy indexes, and centralized governance frameworks.',
          },
          {
            id: 6,
            name: 'Ekinrin-Adde',
            slug: 'ekinrin-adde',
            lga: 'Ijumu',
            districtOrClan: 'Ijumu Clan',
            historicalBackground:
              'A deeply proactive regional center renowned for strong community self-help infrastructure, annual heritage carnivals, and influential commercial diasporas.',
          },
        ];

  // Apply query matching
  const displayList = baseList.filter((town) => {
    if (!query) {
      return true;
    }
    return (
      town.name.toLowerCase().includes(query) ||
      (town.lga && town.lga.toLowerCase().includes(query)) ||
      (town.districtOrClan && town.districtOrClan.toLowerCase().includes(query)) ||
      (town.historicalBackground && town.historicalBackground.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-12 py-4">
      {/* Immersive Section Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-gray-900 to-amber-950 px-6 py-12 text-center text-white shadow-xl dark:from-gray-950 dark:via-black dark:to-emerald-950 sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <h1 className="relative z-10 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Okun Communities Explorer
        </h1>
        <p className="relative z-10 mx-auto mt-4 max-w-2xl text-xs text-gray-300 sm:text-base">
          Browse comprehensive geographical archives, paramount lineage entries, and development parameters across the documented townships.
        </p>

        {/* Live Filter Controls Strip */}
        <div className="relative z-10 mx-auto mt-8 max-w-xl">
          <form
            action="/communities/"
            method="GET"
            className="flex items-center gap-2 rounded-xl bg-white/10 p-1.5 backdrop-blur-md focus-within:ring-2 focus-within:ring-amber-400"
          >
            <input
              type="text"
              name="search"
              defaultValue={rawSearch}
              placeholder="Filter by town, clan, or local government..."
              className="w-full bg-transparent px-3 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-hidden sm:text-sm"
            />
            <Button type="submit" variant="primary" size="sm">
              Filter
            </Button>
            {rawSearch && (
              <Link href="/communities/" className="inline-block focus:outline-hidden">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  Clear
                </Button>
              </Link>
            )}
          </form>

          {/* Quick Filter Subgroups */}
          <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-[11px] text-gray-400">
            <span className="text-gray-500">LGA Belts:</span>
            {['Kabba/Bunu', 'Mopa-Muro', 'Yagba East', 'Yagba West', 'Ijumu'].map((belt) => (
              <Link
                key={belt}
                href={`/communities/?search=${encodeURIComponent(belt)}`}
                className={`rounded-md px-2 py-0.5 transition-colors ${
                  rawSearch === belt
                    ? 'bg-amber-500 font-bold text-gray-950'
                    : 'bg-white/5 hover:bg-white/10 hover:text-gray-200'
                }`}
              >
                {belt}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Profile Listing */}
      {displayList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mt-4 font-serif text-lg font-bold text-gray-900 dark:text-white">
            No Okun communities match your parameters
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Try adjusting your query or click &apos;Clear&apos; to view all registered archives.
          </p>
          <div className="mt-6">
            <Link href="/communities/" className="inline-block focus:outline-hidden">
              <Button variant="outline" size="sm">
                Reset Filters
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayList.map((town) => (
            <CommunityProfileCard key={town.id} community={town} />
          ))}
        </div>
      )}
    </div>
  );
}
