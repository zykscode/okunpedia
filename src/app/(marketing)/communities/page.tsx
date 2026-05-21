import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { db } from '@/libs/DB';
import { townTable, lgaTable } from '@/models/Schema';
import { Search, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CommunityProfileCard } from '@/features/communities/CommunityProfileCard';

export const metadata = {
  title: 'Okun Communities — Explore Traditional Towns & Lineages',
  description:
    'Browse the comprehensive registry of Okun communities with documented local governance hubs, traditional clans, migration archives, and civic metrics across all six LGAs.',
};

export const dynamic = 'force-dynamic';

const lgaBelts = ['Kabba/Bunu', 'Mopa-Muro', 'Yagba East', 'Yagba West', 'Ijumu'];

type TownRow = {
  id: string;
  name: string;
  slug: string;
  lga: string;
  districtOrClan: string;
  historicalBackground: string | null;
};

/** Fetches all published towns joined with their LGA name. */
async function fetchTowns(): Promise<TownRow[]> {
  const rows = await db
    .select({
      id: townTable.id,
      name: townTable.name,
      slug: townTable.slug,
      lga: lgaTable.name,
      districtOrClan: townTable.tagline,
      historicalBackground: townTable.overview,
    })
    .from(townTable)
    .innerJoin(lgaTable, eq(townTable.lgaId, lgaTable.id))
    .where(eq(townTable.published, true))
    .orderBy(townTable.name);

  return rows.map((r) => ({
    ...r,
    districtOrClan: r.districtOrClan ?? `${r.lga} LGA`,
    historicalBackground: r.historicalBackground ?? null,
  }));
}

export default async function CommunitiesPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const rawSearch = typeof searchParams.search === 'string' ? searchParams.search : '';
  const query = rawSearch.toLowerCase().trim();

  let towns: TownRow[] = [];
  try {
    towns = await fetchTowns();
  } catch {
    towns = [];
  }

  const displayList = towns.filter((town) => {
    if (!query) return true;
    return (
      town.name.toLowerCase().includes(query)
      || town.lga.toLowerCase().includes(query)
      || town.districtOrClan.toLowerCase().includes(query)
      || (town.historicalBackground && town.historicalBackground.toLowerCase().includes(query))
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
                placeholder="Filter by town, LGA, or keyword..."
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
