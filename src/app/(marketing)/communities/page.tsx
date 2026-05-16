import { db } from '@/libs/DB';
import Link from 'next/link';
import { communitiesSchema } from '@/models/Schema';
import { Search, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CommunityProfileCard } from '@/features/communities/CommunityProfileCard';

export const metadata = {
  title: 'Okun Communities — Explore Traditional Towns & Lineages',
  description:
    'Browse the comprehensive registry of Okun communities with documented local governance hubs, traditional clans, migration archives, and civic metrics across all six LGAs.',
};

const lgaBelts = ['Kabba/Bunu', 'Mopa-Muro', 'Yagba East', 'Yagba West', 'Ijumu'];

const staticCommunities = [
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

export default async function CommunitiesPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const rawSearch = typeof searchParams.search === 'string' ? searchParams.search : '';
  const query = rawSearch.toLowerCase().trim();

  let communities: Array<typeof communitiesSchema.$inferSelect> = [];
  try {
    communities = await db.select().from(communitiesSchema);
  } catch {
    communities = [];
  }

  const baseList = communities.length > 0 ? communities : staticCommunities;

  const displayList = baseList.filter((town) => {
    if (!query) return true;
    return (
      town.name.toLowerCase().includes(query) ||
      (town.lga && town.lga.toLowerCase().includes(query)) ||
      (town.districtOrClan && town.districtOrClan.toLowerCase().includes(query)) ||
      (town.historicalBackground && town.historicalBackground.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-12">
      {/* Page header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-gray-900 to-amber-950 px-6 py-14 text-center text-white shadow-xl sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" aria-hidden="true" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2">
            <Badge variant="emerald" className="backdrop-blur-sm">
              <MapPin className="size-3" aria-hidden="true" />
              Kogi State, Nigeria
            </Badge>
          </div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Okun Communities
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
            Browse comprehensive geographical archives, paramount lineage entries, and development
            parameters across documented townships.
          </p>

          {/* Search form */}
          <div className="mx-auto mt-8 max-w-xl">
            <form
              action="/communities/"
              method="GET"
              className="flex items-center gap-2 rounded-2xl bg-white/10 p-1.5 backdrop-blur-md ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-amber-400/70"
            >
              <Search className="ml-3 size-4 shrink-0 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                name="search"
                defaultValue={rawSearch}
                placeholder="Filter by town, clan, or local government..."
                className="w-full bg-transparent px-2 py-2 text-sm text-white placeholder-gray-400 focus:outline-hidden"
                aria-label="Filter communities"
              />
              <Button type="submit" variant="accent" size="sm" className="shrink-0">
                Filter
              </Button>
              {rawSearch && (
                <Link href="/communities/" className="shrink-0 focus:outline-hidden">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    Clear
                  </Button>
                </Link>
              )}
            </form>

            {/* LGA quick filters */}
            <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-xs text-gray-400">
              <span className="font-medium text-gray-500">LGA:</span>
              {lgaBelts.map((belt) => (
                <Link
                  key={belt}
                  href={`/communities/?search=${encodeURIComponent(belt)}`}
                  className={[
                    'rounded-lg px-2.5 py-1 transition-colors',
                    rawSearch === belt
                      ? 'bg-amber-500 font-semibold text-gray-950'
                      : 'bg-white/8 hover:bg-white/15 hover:text-gray-200',
                  ].join(' ')}
                >
                  {belt}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {displayList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center dark:border-gray-800 dark:bg-gray-900/60">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <Search className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-serif text-lg font-bold text-gray-900 dark:text-white">
            No communities match your search
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your query or clear the filter to view all registered archives.
          </p>
          <div className="mt-6">
            <Link href="/communities/" className="focus:outline-hidden">
              <Button variant="outline" size="md">
                Reset Filters
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">{displayList.length}</span>{' '}
              {displayList.length === 1 ? 'community' : 'communities'} found
              {query && (
                <span>
                  {' '}for{' '}
                  <span className="font-medium text-gray-900 dark:text-white">&ldquo;{rawSearch}&rdquo;</span>
                </span>
              )}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayList.map((town) => (
              <CommunityProfileCard key={town.id} community={town} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
