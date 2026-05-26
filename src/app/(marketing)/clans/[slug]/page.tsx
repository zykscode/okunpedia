import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ChevronLeft, Shield, Users, Landmark } from 'lucide-react';

import { db } from '@/libs/DB';
import { townTable, lgaTable } from '@/models/Schema';
import { CommunityProfileCard } from '@/features/communities/CommunityProfileCard';
import { OKUN_CLANS, getClanSlug } from '@/utils/clanMatcher';
import { Button } from '@/components/ui/Button';
import { AppConfig } from '@/utils/AppConfig';

type ClanPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return OKUN_CLANS.map((clan) => ({ slug: clan.slug }));
}

export async function generateMetadata(props: ClanPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const clan = OKUN_CLANS.find((c) => c.slug === slug);
  if (!clan) {
    return {};
  }

  const title = `${clan.name} Clan — Cultural Lineage & Towns | Okunpedia`;
  const description = clan.description.length > 160 ? `${clan.description.slice(0, 157)}...` : clan.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${AppConfig.siteUrl}/clans/${slug}`,
      siteName: AppConfig.title,
      images: [
        {
          url: `${AppConfig.siteUrl}/static/images/hero-bg.jpg`,
          width: 1200,
          height: 630,
          alt: `${clan.name} Clan Heritage Profile`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${AppConfig.siteUrl}/static/images/hero-bg.jpg`],
    },
  };
}

export default async function ClanPage(props: ClanPageProps) {
  const { slug } = await props.params;
  const clan = OKUN_CLANS.find((c) => c.slug === slug);

  if (!clan) {
    notFound();
  }

  // Fetch all published towns and dynamically match against current clan slug
  const allTowns = await db
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

  const clanTowns = allTowns
    .filter((town) => {
      const matchSlug = getClanSlug({
        districtOrClan: town.districtOrClan,
        lgaName: town.lga,
        townName: town.name,
        overview: town.historicalBackground,
      });
      return matchSlug === slug;
    })
    .map((town) => ({
      ...town,
      districtOrClan: town.districtOrClan ?? `${town.lga} LGA`,
      historicalBackground: town.historicalBackground ?? null,
    }));

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-2">
      <nav aria-label="Breadcrumb">
        <Link href="/communities/" className="focus:outline-hidden">
          <Button variant="ghost" size="sm" className="-ml-1 gap-1.5">
            <ChevronLeft className="size-4" aria-hidden="true" />
            Back to Communities
          </Button>
        </Link>
      </nav>

      {/* Hero section */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-gray-900 to-emerald-950 px-8 py-14 text-white shadow-xl sm:px-14 md:px-16">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div className="relative z-10 flex items-center gap-2">
          <Shield className="size-5 text-amber-400" />
          <span className="text-sm font-semibold tracking-wider uppercase text-amber-400">
            Okun Heritage Clan Profile
          </span>
        </div>
        <h1 className="relative z-10 mt-4 font-serif text-4xl font-black tracking-tight text-white sm:text-6xl">
          The {clan.name} Clan
        </h1>
        <div className="relative z-10 mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400" />

        {/* Info Grid */}
        <div className="relative z-10 mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:grid-cols-3 md:gap-8">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Heritage Type</span>
            <span className="mt-1 flex items-center gap-1.5 text-base font-bold text-white sm:text-lg">
              <Landmark className="size-4 text-emerald-400" />
              Dialectal Clan
            </span>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Communities Map</span>
            <span className="mt-1 flex items-center gap-1.5 text-base font-bold text-white sm:text-lg">
              <Users className="size-4 text-amber-400" />
              {clanTowns.length} towns profiled
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Card / Overview */}
        <section className="space-y-6 md:col-span-2">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900/60">
            <h2 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
              Origin & Lineage Chronicles
            </h2>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
            <p className="mt-5 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
              {clan.description}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              The {clan.name} traditional structure is tied deeply to ancestral migration lines that converged in Kogi State, establishing distinct linguistic inflections and farming patterns that persist today.
            </p>
          </div>
        </section>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-50/40 p-6 dark:border-emerald-500/15 dark:bg-emerald-950/15">
            <h3 className="font-serif text-base font-bold text-emerald-900 dark:text-emerald-300">
              Linguistic Heritage
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-emerald-950/80 dark:text-emerald-300/80">
              Okun dialects are a sub-family of the Yoruboid branch of Niger-Congo languages. Each clan preserves unique vocabulary and tonal inflections specific to their historic territory.
            </p>
          </div>
        </div>
      </div>

      {/* Towns Grid */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
            Communities of the {clan.name} Clan
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Explore detailed community registries matching the historical settlement footprint of the {clan.name} people.
          </p>
        </div>

        {clanTowns.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clanTowns.map((town) => (
              <CommunityProfileCard key={town.id} community={town} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No communities are currently classified under this clan.</p>
          </div>
        )}
      </section>
    </div>
  );
}
