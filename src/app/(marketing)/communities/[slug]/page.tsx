import { eq, or, inArray } from "drizzle-orm";
import { ChevronLeft, Crown, Star, AlertCircle, Network, Link2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Markdown } from "@/components/Markdown";
import { db } from "@/libs/DB";
import {
  communitiesSchema,
  lgaTable,
  prominentIndigenesSchema,
  traditionalRulersSchema,
  communityHierarchySchema,
  communityRelationshipsSchema,
} from "@/models/Schema";

import { AppConfig } from "@/utils/AppConfig";
import { getClanSlug } from "@/utils/clanMatcher";

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
        <Link
          href={`/lgas/${lgaSlug}`}
          className="hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <Badge variant="emerald">{town.lga} LGA</Badge>
        </Link>
        {clanSlug ? (
          <Link
            href={`/clans/${clanSlug}`}
            className="hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
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
              <span className="font-semibold text-white">{town.population.toLocaleString()}</span>{" "}
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

/**
 * Renders the historical background section.
 * @param props Component properties.
 * @returns React node representing the historical background section.
 */
function HistoricalBackgroundSection(props: {
  historicalBackground: string | null;
  overview: string | null;
}) {
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900/60">
      <h2 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
        Historical Background
      </h2>
      <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
      <Markdown
        content={
          props.historicalBackground ?? props.overview ?? "No historical overview documented yet."
        }
        className="mt-5"
      />
    </section>
  );
}

/**
 * Renders the founding stories section.
 * @param props Component properties.
 * @returns React node representing the founding stories section or null.
 */
function FoundingStoriesSection(props: { foundingStories: string | null }) {
  if (!props.foundingStories) {
    return null;
  }
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900/60">
      <h2 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
        Founding Lore & Mythologies
      </h2>
      <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
      <Markdown content={props.foundingStories} className="mt-5" />
    </section>
  );
}

/**
 * Renders the culture and traditions section.
 * @param props Component properties.
 * @returns React node representing the culture section or null.
 */
function CultureSection(props: {
  cultureAndTraditions: string | null;
  festivalsAndRituals: string | null;
}) {
  const showCulture = !!(props.cultureAndTraditions ?? props.festivalsAndRituals);
  if (!showCulture) return null;
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900/60">
      <h2 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
        Culture, Festivals & Traditions
      </h2>
      <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
      {props.cultureAndTraditions && (
        <Markdown content={props.cultureAndTraditions} className="mt-5" />
      )}
      {props.festivalsAndRituals && (
        <>
          <h3 className="mt-6 font-serif text-lg font-bold text-gray-900 dark:text-white">
            Festivals & Rituals
          </h3>
          <Markdown content={props.festivalsAndRituals} className="mt-3" />
        </>
      )}
    </section>
  );
}

/**
 * Renders the economic activities section.
 * @param props Component properties.
 * @returns React node representing the economic activities section or null.
 */
function EconomicLandscapeSection(props: { economicActivities: string | null }) {
  if (!props.economicActivities) return null;
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900/60">
      <h2 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
        Economic Landscape
      </h2>
      <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
      <Markdown content={props.economicActivities} className="mt-5" />
    </section>
  );
}

/**
 * Renders the notable facts section.
 * @param props Component properties.
 * @returns React node representing the facts section or null.
 */
function FactsSection(props: { randomFacts: unknown }) {
  const facts = Array.isArray(props.randomFacts) ? props.randomFacts : [];
  if (facts.length === 0) return null;
  return (
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
  );
}

/**
 * Renders coordinates sidebar block.
 * @param props Component properties.
 * @returns React node representing coordinates section or null.
 */
function CoordinatesSection(props: { lat: number | null; lng: number | null }) {
  if (props.lat === null || props.lng === null) return null;
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
      <h2 className="font-serif text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-white">
        Coordinates
      </h2>
      <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
      <p className="mt-3 font-mono text-xs text-gray-600 dark:text-gray-400">
        {props.lat.toFixed(6)}, {props.lng.toFixed(6)}
      </p>
    </div>
  );
}

function DetailContent(props: {
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
  parents: { id: number; name: string; slug: string; context: string }[];
  children: { id: number; name: string; slug: string; context: string }[];
  relationships: {
    id: number;
    relationshipType: string;
    description: string | null;
    name: string;
    slug: string;
  }[];
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <HistoricalBackgroundSection
          historicalBackground={props.town.historicalBackground}
          overview={props.town.overview}
        />
        <FoundingStoriesSection foundingStories={props.town.foundingStories} />
        <CultureSection
          cultureAndTraditions={props.town.cultureAndTraditions}
          festivalsAndRituals={props.town.festivalsAndRituals}
        />
        <EconomicLandscapeSection economicActivities={props.town.economicActivities} />
        <FactsSection randomFacts={props.town.randomFacts} />
      </div>

      <aside className="space-y-6" aria-label="Community highlights">
        <RulersSection rulers={props.rulers} />
        <IndigenesSection indigenes={props.indigenes} />
        <ConnectionsSection
          parents={props.parents}
          children={props.children}
          relationships={props.relationships}
        />
        <CoordinatesSection lat={props.town.lat} lng={props.town.lng} />
      </aside>
    </div>
  );
}

/**
 * Renders traditional rulers / paramount monarchy sidebar block.
 * @param props Component properties.
 * @returns React node representing rulers section.
 */
function RulersSection(props: { rulers: RulerItem[] }) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
      <h2 className="flex items-center gap-2 font-serif text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-white">
        <Crown className="size-4 text-amber-500" aria-hidden="true" />
        Paramount Monarchy
      </h2>
      <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
      {props.rulers.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {props.rulers.map((r, i) => (
            <li
              key={String(i)}
              className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-900/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{r.title}</span>
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
  );
}

/**
 * Renders prominent indigenes sidebar block.
 * @param props Component properties.
 * @returns React node representing indigenes section.
 */
function IndigenesSection(props: { indigenes: IndigeneItem[] }) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
      <h2 className="flex items-center gap-2 font-serif text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-white">
        <Star className="size-4 text-emerald-500" aria-hidden="true" />
        Prominent Indigenes
      </h2>
      <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
      {props.indigenes.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {props.indigenes.map((ind, i) => (
            <li
              key={String(i)}
              className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-900/40"
            >
              <span className="text-sm font-bold text-gray-900 dark:text-white">{ind.name}</span>
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
  );
}

/**
 * Renders community connections sidebar block (parents, children, relationships).
 * @param props Component properties.
 * @returns React node representing connections section.
 */
function ConnectionsSection(props: {
  parents: { id: number; name: string; slug: string; context: string }[];
  children: { id: number; name: string; slug: string; context: string }[];
  relationships: {
    id: number;
    relationshipType: string;
    description: string | null;
    name: string;
    slug: string;
  }[];
}) {
  const hasConnections =
    props.parents.length > 0 || props.children.length > 0 || props.relationships.length > 0;

  if (!hasConnections) return null;

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
      <h2 className="flex items-center gap-2 font-serif text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-white">
        <Network className="size-4 text-emerald-500" aria-hidden="true" />
        Community Connections
      </h2>
      <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />

      <div className="mt-4 space-y-5">
        {/* Parents */}
        {props.parents.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Parent Community
            </h3>
            <div className="mt-2 space-y-2">
              {props.parents.map((p) => (
                <Link
                  key={p.slug}
                  href={`/communities/${p.slug}`}
                  className="flex flex-col gap-0.5 rounded-xl border border-emerald-100 bg-emerald-50/20 p-2.5 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors dark:border-emerald-950/40 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20"
                >
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
                    {p.name}
                  </span>
                  {p.context && (
                    <span className="text-[10px] text-gray-500 capitalize">
                      {p.context} relation
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Children */}
        {props.children.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Quarters & Sub-towns
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {props.children.map((c) => (
                <Link
                  key={c.slug}
                  href={`/communities/${c.slug}`}
                  className="flex items-center justify-center rounded-xl border border-gray-100 bg-gray-50/50 px-2.5 py-2 text-center text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Relationships */}
        {props.relationships.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Historical & Cultural Ties
            </h3>
            <div className="mt-2 space-y-2">
              {props.relationships.map((r) => (
                <Link
                  key={r.slug}
                  href={`/communities/${r.slug}`}
                  className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-gray-50/50 p-2.5 hover:bg-gray-100 transition-colors dark:border-gray-800 dark:bg-gray-900/40 dark:hover:bg-gray-800"
                >
                  <Link2 className="mt-0.5 size-3.5 shrink-0 text-blue-500" aria-hidden="true" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-gray-900 dark:text-white hover:underline">
                      {r.name}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 capitalize">
                      {r.relationshipType.replace("_", " ")}
                    </span>
                    {r.description && (
                      <span className="text-[10px] text-gray-500 line-clamp-2">
                        {r.description}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
const getTownBySlug = unstable_cache(
  async (slug: string) => {
    const townRows = await db
      .select({
        id: communitiesSchema.id,
        name: communitiesSchema.name,
        slug: communitiesSchema.slug,
        tagline: communitiesSchema.tagline,
        overview: communitiesSchema.overview,
        lat: communitiesSchema.latitude,
        lng: communitiesSchema.longitude,
        population: communitiesSchema.population,
        founded: communitiesSchema.founded,
        lga: lgaTable.name,
        historicalBackground: communitiesSchema.historicalBackground,
        foundingStories: communitiesSchema.foundingStories,
        cultureAndTraditions: communitiesSchema.cultureAndTraditions,
        festivalsAndRituals: communitiesSchema.festivalsAndRituals,
        economicActivities: communitiesSchema.economicActivities,
        districtOrClan: communitiesSchema.districtOrClan,
        communityId: communitiesSchema.id,
      })
      .from(communitiesSchema)
      .innerJoin(lgaTable, eq(communitiesSchema.lgaId, lgaTable.id))
      .where(eq(communitiesSchema.slug, slug))
      .limit(1);
    return townRows[0] || null;
  },
  ["town-by-slug-cache"],
  { tags: ["communities"] },
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
  ["new-rulers-by-community-cache"],
  { tags: ["communities"] },
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
  ["new-indigenes-by-community-cache"],
  { tags: ["communities"] },
);

const getParentsByCommunityId = unstable_cache(
  async (communityId: number) =>
    await db
      .select({
        id: communitiesSchema.id,
        name: communitiesSchema.name,
        slug: communitiesSchema.slug,
        context: communityHierarchySchema.context,
      })
      .from(communityHierarchySchema)
      .innerJoin(communitiesSchema, eq(communityHierarchySchema.parentId, communitiesSchema.id))
      .where(eq(communityHierarchySchema.childId, communityId)),
  ["parents-by-community-cache"],
  { tags: ["communities"] },
);

const getChildrenByCommunityId = unstable_cache(
  async (communityId: number) =>
    await db
      .select({
        id: communitiesSchema.id,
        name: communitiesSchema.name,
        slug: communitiesSchema.slug,
        context: communityHierarchySchema.context,
      })
      .from(communityHierarchySchema)
      .innerJoin(communitiesSchema, eq(communityHierarchySchema.childId, communitiesSchema.id))
      .where(eq(communityHierarchySchema.parentId, communityId)),
  ["children-by-community-cache"],
  { tags: ["communities"] },
);

const getRelationshipsByCommunityId = unstable_cache(
  async (communityId: number) => {
    const rels = await db
      .select({
        id: communityRelationshipsSchema.id,
        sourceCommunityId: communityRelationshipsSchema.sourceCommunityId,
        targetCommunityId: communityRelationshipsSchema.targetCommunityId,
        relationshipType: communityRelationshipsSchema.relationshipType,
        description: communityRelationshipsSchema.description,
      })
      .from(communityRelationshipsSchema)
      .where(
        or(
          eq(communityRelationshipsSchema.sourceCommunityId, communityId),
          eq(communityRelationshipsSchema.targetCommunityId, communityId),
        ),
      );

    if (rels.length === 0) return [];

    const relatedIds = rels.map((r) =>
      r.sourceCommunityId === communityId ? r.targetCommunityId : r.sourceCommunityId,
    );

    const relatedTowns = await db
      .select({
        id: communitiesSchema.id,
        name: communitiesSchema.name,
        slug: communitiesSchema.slug,
      })
      .from(communitiesSchema)
      .where(inArray(communitiesSchema.id, relatedIds));

    return rels.map((r) => {
      const relatedId =
        r.sourceCommunityId === communityId ? r.targetCommunityId : r.sourceCommunityId;
      const town = relatedTowns.find((t) => t.id === relatedId);
      return {
        id: r.id,
        relationshipType: r.relationshipType,
        description: r.description,
        name: town?.name ?? "Unknown",
        slug: town?.slug ?? "",
      };
    });
  },
  ["relationships-by-community-cache"],
  { tags: ["communities"] },
);

export async function generateStaticParams() {
  try {
    const towns = await db.select({ slug: communitiesSchema.slug }).from(communitiesSchema);
    return towns.map((town) => ({
      slug: town.slug,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams for communities:", error);
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
      description =
        town.overview.length > 160 ? `${town.overview.slice(0, 157)}...` : town.overview;
    }

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
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
        card: "summary_large_image",
        title,
        description,
        images: [`${AppConfig.siteUrl}/static/images/hero-bg.jpg`],
      },
    };
  } catch (error) {
    console.error(`Error in generateMetadata for community slug ${slug}:`, error);
    return {
      title: "Community Profile — Okunpedia",
      description: "Explore historical heritage and governance profiles of Okun communities.",
    };
  }
}

export default async function CommunityDetailPage(props: DetailPageProps) {
  const { slug } = await props.params;

  let town = null;
  let newRulers: {
    id: number;
    title: string;
    name: string;
    reignStart: string | null;
    reignEnd: string | null;
    isIncumbent: boolean | null;
  }[] = [];
  let newIndigenes: { id: number; name: string; biography: string }[] = [];
  let parents: { id: number; name: string; slug: string; context: string }[] = [];
  let children: { id: number; name: string; slug: string; context: string }[] = [];
  let relationships: {
    id: number;
    relationshipType: string;
    description: string | null;
    name: string;
    slug: string;
  }[] = [];
  let fetchError = false;

  try {
    town = await getTownBySlug(slug);
    if (town) {
      const { communityId } = town;
      const [resNewRulers, resNewIndigenes, resParents, resChildren, resRelationships] =
        await Promise.all([
          communityId ? getNewRulersByCommunityId(communityId) : Promise.resolve([]),
          communityId ? getNewIndigenesByCommunityId(communityId) : Promise.resolve([]),
          communityId ? getParentsByCommunityId(communityId) : Promise.resolve([]),
          communityId ? getChildrenByCommunityId(communityId) : Promise.resolve([]),
          communityId ? getRelationshipsByCommunityId(communityId) : Promise.resolve([]),
        ]);
      newRulers = resNewRulers;
      newIndigenes = resNewIndigenes;
      parents = resParents;
      children = resChildren;
      relationships = resRelationships;
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
      const startStr = r.reignStart || "";
      const endStr = r.reignEnd || "";
      titleStr =
        startStr && endStr
          ? `${r.title} (${startStr}–${endStr})`
          : `${r.title} (${startStr || endStr})`;
    }
    return { title: titleStr, name: r.name, isIncumbent: r.isIncumbent ?? false };
  });

  const rulers: RulerItem[] = customRulers;

  const indigenes: IndigeneItem[] = newIndigenes.map((ind) => ({
    name: ind.name,
    biography: ind.biography,
  }));

  const districtOrClan = town.districtOrClan || town.tagline || `${town.lga} LGA`;
  const lgaSlug = town.lga
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/gu, "-")
    .replaceAll(/(^-|-$)/gu, "");
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
        town={{ ...town, randomFacts: [] }}
        rulers={rulers}
        indigenes={indigenes}
        parents={parents}
        children={children}
        relationships={relationships}
      />
    </article>
  );
}
