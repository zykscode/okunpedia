import { eq } from 'drizzle-orm';
import { ChevronLeft, Crown, Star, AlertCircle } from 'lucide-react';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Markdown } from '@/components/Markdown';
import { db } from '@/libs/DB';
import {
  townTable,
  lgaTable,
  prominentPersonTable,
  communitiesSchema,
  prominentIndigenesSchema,
  traditionalRulersSchema,
} from '@/models/Schema';

import { AppConfig } from '@/utils/AppConfig';
import { getClanSlug } from '@/utils/clanMatcher';

type DetailPageProps = { params: Promise<{ slug: string }> };

type RulerItem = { title: string; name: string; isIncumbent?: boolean };
type IndigeneItem = { name: string; biography: string };

type ErrorViewProps = {
  slug: string;
};

/**
 * Error view for connection timeouts.
 * @param props Component properties.
 * @returns React node representing the connection timeout view.
 */
function ErrorView(props: ErrorViewProps) {
  return (
    <article className="mx-auto max-w-5xl space-y-8 py-2">
      <nav aria-label="Breadcrumb">
        <Link href="/communities/" className="focus:outline-hidden">
          <Button variant="ghost" size="sm" className="-ml-1 gap-1.5">
            <ChevronLeft className="size-4" aria-hidden="true" />
            Back to Communities
          </Button>
        </Link>
      </nav>

      <div className="rounded-2xl border border-red-500/25 bg-red-50/50 p-8 text-center dark:border-red-950/40 dark:bg-red-950/15">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
          <AlertCircle className="size-6" aria-hidden="true" />
        </div>
        <h2 className="mt-5 font-serif text-lg font-bold text-gray-900 dark:text-white">
          Connection Timeout
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
          A temporary connection issue occurred while loading this community's profile. Please try
          reloading the page.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/communities/" className="focus:outline-hidden">
            <Button variant="outline" size="md">
              All Communities
            </Button>
          </Link>
          <Link href={`/communities/${props.slug}`} className="focus:outline-hidden">
            <Button variant="accent" size="md" className="gap-2">
              Retry Connection
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

type DetailHeaderProps = {
  town: {
    name: string;
    lga: string;
    population: number | null;
    founded: string | null;
  };
  lgaSlug: string;
  clanSlug: string | null;
  districtOrClan: string;
};

/**
 * Header section with title and stats.
 * @param props Component properties.
 * @returns React node representing the header.
 */
function DetailHeader(props: DetailHeaderProps) {
  const { town, lgaSlug, clanSlug, districtOrClan } = props;
  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-gray-900 to-amber-950 px-8 py-14 text-white shadow-xl sm:px-14 md:px-16">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-wrap items-center gap-2.5">
        <Link href={`/lgas/${lgaSlug}`} className="hover:scale-[1.02] active:scale-[0.98] transition-transform">
          <Badge variant="emerald">{town.lga} LGA</Badge>
        </Link>
        {clanSlug ? (
          <Link href={`/clans/${clanSlug}`} className="hover:scale-[1.02] active:scale-[0.98] transition-transform">
            <Badge variant="amber">{districtOrClan}</Badge>
          </Link>
        ) : (
          <Badge variant="amber">{districtOrClan}</Badge>
        )}
      </div>
      <h1 className="relative z-10 mt-5 font-serif text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
        {town.name}
      </h1>
      <div className="relative z-10 mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-amber-400 to-emerald-500" />

      {(town.population !== null || town.founded !== null) && (
        <div className="relative z-10 mt-6 flex flex-wrap gap-4 text-sm text-gray-300">
          {town.population !== null && (
            <span>
              <span className="font-semibold text-white">{town.population.toLocaleString()}</span>{' '}
              estimated population
            </span>
          )}
          {town.founded !== null && (
            <span>
              Founded <span className="font-semibold text-white">{town.founded}</span>
            </span>
          )}
        </div>
      )}
    </header>
  );
}

type DetailContentProps = {
  town: {
    historicalBackground: string | null;
    overview: string | null;
    foundingStories: string | null;
    cultureAndTraditions: string | null;
    festivalsAndRituals: string | null;
    economicActivities: string | null;
    randomFacts: unknown;
    lat: number | null;
    lng: number | null;
  };
  rulers: RulerItem[];
  indigenes: IndigeneItem[];
};

/**
 * Main content body containing history, lore, culture, economics, facts, and sidebar highlights.
 * @param props Component properties.
 * @returns React node representing main content.
 */
function DetailContent(props: DetailContentProps) {
  const { town, rulers, indigenes } = props;
  const showCulture = !!(town.cultureAndTraditions || town.festivalsAndRituals);
  const facts = Array.isArray(town.randomFacts) ? town.randomFacts : [];

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900/60">
          <h2 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
            Historical Background
          </h2>
          <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
          <Markdown
            content={town.historicalBackground || town.overview || 'No historical overview documented yet.'}
            className="mt-5"
          />
        </section>

        {town.foundingStories && (
          <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900/60">
            <h2 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
              Founding Lore & Mythologies
            </h2>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
            <Markdown content={town.foundingStories} className="mt-5" />
          </section>
        )}

        {showCulture && (
          <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900/60">
            <h2 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
              Culture, Festivals & Traditions
            </h2>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
            {town.cultureAndTraditions && <Markdown content={town.cultureAndTraditions} className="mt-5" />}
            {town.festivalsAndRituals && (
              <>
                <h3 className="mt-6 font-serif text-lg font-bold text-gray-900 dark:text-white">Festivals & Rituals</h3>
                <Markdown content={town.festivalsAndRituals} className="mt-3" />
              </>
            )}
          </section>
        )}

        {town.economicActivities && (
          <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900/60">
            <h2 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
              Economic Landscape
            </h2>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
            <Markdown content={town.economicActivities} className="mt-5" />
          </section>
        )}

        {facts.length > 0 && (
          <section className="rounded-2xl border border-amber-500/25 bg-amber-50/40 p-6 sm:p-8 dark:border-amber-500/15 dark:bg-amber-950/15">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                <AlertCircle className="size-4" aria-hidden="true" />
              </div>
              <h2 className="font-serif text-base font-bold text-amber-900 sm:text-lg dark:text-amber-300">
                Notable Facts
              </h2>
            </div>
            <div className="mt-4 h-px bg-amber-200/50 dark:bg-amber-800/30" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {facts.map((fact, i) => (
                <li
                  key={String(i)}
                  className="flex items-start gap-2.5 rounded-xl border border-amber-200/50 bg-white/70 px-3.5 py-2.5 text-sm text-amber-900 dark:border-amber-800/30 dark:bg-gray-900/40 dark:text-amber-300"
                >
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500"
                    aria-hidden="true"
                  />
                  {String(fact)}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <aside className="space-y-6" aria-label="Community highlights">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
          <h2 className="flex items-center gap-2 font-serif text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-white">
            <Crown className="size-4 text-amber-500" aria-hidden="true" />
            Paramount Monarchy
          </h2>
          <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
          {rulers.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {rulers.map((r, i) => (
                <li
                  key={String(i)}
                  className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-900/40"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {r.title}
                    </span>
                    {r.isIncumbent && (
                      <Badge variant="success" className="text-[10px]">
                        Incumbent
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{r.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-400 italic">
              Traditional records currently synchronising.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
          <h2 className="flex items-center gap-2 font-serif text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-white">
            <Star className="size-4 text-emerald-500" aria-hidden="true" />
            Prominent Indigenes
          </h2>
          <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
          {indigenes.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {indigenes.map((ind, i) => (
                <li
                  key={String(i)}
                  className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-900/40"
                >
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {ind.name}
                  </span>
                  <span className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    {ind.biography}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-400 italic">Elders directory caching state.</p>
          )}
        </div>

        {town.lat !== null && town.lng !== null && (
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
            <h2 className="font-serif text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-white">
              Coordinates
            </h2>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
            <p className="mt-3 font-mono text-xs text-gray-600 dark:text-gray-400">
              {town.lat.toFixed(6)}, {town.lng.toFixed(6)}
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

const getTownBySlug = unstable_cache(
  async (slug: string) => {
    const townRows = await db
      .select({
        id: townTable.id,
        name: townTable.name,
        slug: townTable.slug,
        tagline: townTable.tagline,
        overview: townTable.overview,
        rulerTitle: townTable.rulerTitle,
        traditionalRuler: townTable.traditionalRuler,
        lat: townTable.lat,
        lng: townTable.lng,
        population: townTable.population,
        founded: townTable.founded,
        randomFacts: townTable.randomFacts,
        lga: lgaTable.name,
        historicalBackground: communitiesSchema.historicalBackground,
        foundingStories: communitiesSchema.foundingStories,
        cultureAndTraditions: communitiesSchema.cultureAndTraditions,
        festivalsAndRituals: communitiesSchema.festivalsAndRituals,
        economicActivities: communitiesSchema.economicActivities,
        districtOrClan: communitiesSchema.districtOrClan,
        communityId: communitiesSchema.id,
      })
      .from(townTable)
      .innerJoin(lgaTable, eq(townTable.lgaId, lgaTable.id))
      .leftJoin(communitiesSchema, eq(townTable.slug, communitiesSchema.slug))
      .where(eq(townTable.slug, slug))
      .limit(1);
    return townRows[0] || null;
  },
  ['town-by-slug-cache'],
  { tags: ['communities'] },
);

const getPersonsByTownId = unstable_cache(
  async (townId: string) =>
    await db
      .select({
        id: prominentPersonTable.id,
        name: prominentPersonTable.name,
        title: prominentPersonTable.title,
        biography: prominentPersonTable.biography,
      })
      .from(prominentPersonTable)
      .where(eq(prominentPersonTable.townId, townId)),
  ['persons-by-town-cache'],
  { tags: ['communities'] },
);

const getNewRulersByCommunityId = unstable_cache(
  async (communityId: number) =>
    await db
      .select({
        id: traditionalRulersSchema.id,
        title: traditionalRulersSchema.title,
        name: traditionalRulersSchema.name,
        reignStart: traditionalRulersSchema.reignStart,
        reignEnd: traditionalRulersSchema.reignEnd,
        isIncumbent: traditionalRulersSchema.isIncumbent,
      })
      .from(traditionalRulersSchema)
      .where(eq(traditionalRulersSchema.communityId, communityId)),
  ['new-rulers-by-community-cache'],
  { tags: ['communities'] },
);

const getNewIndigenesByCommunityId = unstable_cache(
  async (communityId: number) =>
    await db
      .select({
        id: prominentIndigenesSchema.id,
        name: prominentIndigenesSchema.name,
        biography: prominentIndigenesSchema.biography,
      })
      .from(prominentIndigenesSchema)
      .where(eq(prominentIndigenesSchema.communityId, communityId)),
  ['new-indigenes-by-community-cache'],
  { tags: ['communities'] },
);

export async function generateStaticParams() {
  try {
    const towns = await db.select({ slug: townTable.slug }).from(townTable);
    return towns.map((town) => ({
      slug: town.slug,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams for communities:', error);
    return [];
  }
}

export async function generateMetadata(props: DetailPageProps) {
  const { slug } = await props.params;
  try {
    const town = await getTownBySlug(slug);
    const name = town?.name ?? slug.charAt(0).toUpperCase() + slug.slice(1);
    const title = `${name} — Heritage & Infrastructure Profile | Okunpedia`;
    let description = `Detailed heritage, historical migration patterns, ancestral governance, paramount monarchs, and public amenities for ${name}.`;
    if (town?.overview) {
      description = town.overview.length > 160 ? `${town.overview.slice(0, 157)}...` : town.overview;
    }

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        url: `${AppConfig.siteUrl}/communities/${slug}`,
        siteName: AppConfig.title,
        images: [
          {
            url: `${AppConfig.siteUrl}/static/images/hero-bg.jpg`,
            width: 1200,
            height: 630,
            alt: `${name} Community Heritage Profile`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${AppConfig.siteUrl}/static/images/hero-bg.jpg`],
      },
    };
  } catch (error) {
    console.error(`Error in generateMetadata for community slug ${slug}:`, error);
    return {
      title: 'Community Profile — Okunpedia',
      description: 'Explore historical heritage and governance profiles of Okun communities.',
    };
  }
}

export default async function CommunityDetailPage(props: DetailPageProps) {
  const { slug } = await props.params;

  let town = null;
  let persons: { id: string; name: string; title: string | null; biography: string | null }[] = [];
  let newRulers: { id: number; title: string; name: string; reignStart: string | null; reignEnd: string | null; isIncumbent: boolean | null }[] = [];
  let newIndigenes: { id: number; name: string; biography: string }[] = [];
  let fetchError = false;

  try {
    town = await getTownBySlug(slug);
    if (town) {
      const { id: townId, communityId } = town;
      const [resPersons, resNewRulers, resNewIndigenes] = await Promise.all([
        getPersonsByTownId(townId),
        communityId ? getNewRulersByCommunityId(communityId) : Promise.resolve([]),
        communityId ? getNewIndigenesByCommunityId(communityId) : Promise.resolve([]),
      ]);
      persons = resPersons;
      newRulers = resNewRulers;
      newIndigenes = resNewIndigenes;
    }
  } catch (error) {
    console.error(`Error loading community detail for slug ${slug}:`, error);
    fetchError = true;
  }

  if (fetchError) {
    return <ErrorView slug={slug} />;
  }

  if (!town) {
    notFound();
  }

  const customRulers: RulerItem[] = newRulers.map((r) => {
    let titleStr = r.title;
    if (r.reignStart || r.reignEnd) {
      const startStr = r.reignStart || '';
      const endStr = r.reignEnd || '';
      titleStr = startStr && endStr
        ? `${r.title} (${startStr}–${endStr})`
        : `${r.title} (${startStr || endStr})`;
    }
    return { title: titleStr, name: r.name, isIncumbent: r.isIncumbent ?? false };
  });

  let rulers: RulerItem[] = [];
  if (customRulers.length > 0) {
    rulers = customRulers;
  } else if (town.rulerTitle && town.traditionalRuler) {
    rulers = [{ title: town.rulerTitle, name: town.traditionalRuler, isIncumbent: true }];
  }

  const customIndigenes: IndigeneItem[] = newIndigenes.map((ind) => ({
    name: ind.name,
    biography: ind.biography,
  }));

  const indigenes: IndigeneItem[] = [
    ...customIndigenes,
    ...persons
      .filter((p) => p.biography && !customIndigenes.some((ci) => ci.name.toLowerCase() === p.name.toLowerCase()))
      .map((p) => ({ name: p.name, biography: p.biography ?? '' })),
  ];

  const districtOrClan = town.districtOrClan || town.tagline || `${town.lga} LGA`;
  const lgaSlug = town.lga.toLowerCase().replaceAll(/[^a-z0-9]+/gu, '-').replaceAll(/(^-|-$)/gu, '');
  const clanSlug = getClanSlug({
    districtOrClan: town.districtOrClan || town.tagline,
    lgaName: town.lga,
    townName: town.name,
    overview: town.overview,
  });

  return (
    <article className="mx-auto max-w-5xl space-y-8 py-2">
      <nav aria-label="Breadcrumb">
        <Link href="/communities/" className="focus:outline-hidden">
          <Button variant="ghost" size="sm" className="-ml-1 gap-1.5">
            <ChevronLeft className="size-4" aria-hidden="true" />
            Back to Communities
          </Button>
        </Link>
      </nav>

      <DetailHeader
        town={town}
        lgaSlug={lgaSlug}
        clanSlug={clanSlug}
        districtOrClan={districtOrClan}
      />

      <DetailContent
        town={town}
        rulers={rulers}
        indigenes={indigenes}
      />
    </article>
  );
}
