import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ChevronLeft, Landmark, Users, MapPin, Sparkles } from 'lucide-react';

import { db } from '@/libs/DB';
import { townTable, lgaTable } from '@/models/Schema';
import { CommunityProfileCard } from '@/features/communities/CommunityProfileCard';
import { OKUN_LGAS } from '@/utils/lgaData';
import { Button } from '@/components/ui/Button';
import { AppConfig } from '@/utils/AppConfig';

type LgaPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(OKUN_LGAS).map((slug) => ({ slug }));
}

export async function generateMetadata(props: LgaPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const lga = OKUN_LGAS[slug];
  if (!lga) {
    return {};
  }

  const title = `${lga.name} LGA — Cultural Heritage & Towns | Okunpedia`;
  const description = lga.description.length > 160 ? `${lga.description.slice(0, 157)}...` : lga.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${AppConfig.siteUrl}/lgas/${slug}`,
      siteName: AppConfig.title,
      images: [
        {
          url: `${AppConfig.siteUrl}/static/images/hero-bg.jpg`,
          width: 1200,
          height: 630,
          alt: `${lga.name} Local Government Area Heritage Profile`,
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

export default async function LgaPage(props: LgaPageProps) {
  const { slug } = await props.params;
  const lga = OKUN_LGAS[slug];

  if (!lga) {
    notFound();
  }

  // Query all published towns belonging to this LGA
  const towns = await db
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
    .where(eq(lgaTable.name, lga.name))
    .orderBy(townTable.name);

  const formattedTowns = towns.map((town) => ({
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
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-gray-900 to-amber-950 px-8 py-14 text-white shadow-xl sm:px-14 md:px-16">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div className="relative z-10 flex items-center gap-2">
          <Landmark className="size-5 text-emerald-400" />
          <span className="text-sm font-semibold tracking-wider uppercase text-emerald-400">
            Local Government Area Profile
          </span>
        </div>
        <h1 className="relative z-10 mt-4 font-serif text-4xl font-black tracking-tight text-white sm:text-6xl">
          {lga.name} LGA
        </h1>
        <div className="relative z-10 mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-amber-400 to-emerald-500" />

        {/* Info Grid */}
        <div className="relative z-10 mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:grid-cols-3 md:gap-8">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Headquarters</span>
            <span className="mt-1 flex items-center gap-1.5 text-base font-bold text-white sm:text-lg">
              <MapPin className="size-4 text-amber-400" />
              {lga.headquarters}
            </span>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Primary Sub-groups</span>
            <span className="mt-1 flex items-center gap-1.5 text-base font-bold text-white sm:text-lg">
              <Users className="size-4 text-emerald-400" />
              {lga.keyStats.primaryTribes.join(', ')}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Documented Towns</span>
            <span className="mt-1 flex items-center gap-1.5 text-base font-bold text-white sm:text-lg">
              <Sparkles className="size-4 text-amber-400" />
              {formattedTowns.length} communities
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
              Geographic & Historic Overview
            </h2>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
            <p className="mt-5 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
              {lga.description}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900/60">
            <h2 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
              Cultural Leadership & Royalty
            </h2>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
            <p className="mt-5 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
              {lga.culturalHighlights}
            </p>
          </div>
        </section>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-500/25 bg-amber-50/40 p-6 dark:border-amber-500/15 dark:bg-amber-950/15">
            <h3 className="font-serif text-base font-bold text-amber-900 dark:text-amber-300">
              Okun Heritage Map Note
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-amber-900/80 dark:text-amber-300/80">
              Traditional boundaries of Okun sub-groups often overlap local government divisions. Historically, sub-groups like Yagba are spread across multiple modern LGAs.
            </p>
          </div>
        </div>
      </div>

      {/* Towns Grid */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
            Documented Towns in {lga.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Explore heritage, infrastructure, and lineage data for communities in this Local Government Area.
          </p>
        </div>

        {formattedTowns.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {formattedTowns.map((town) => (
              <CommunityProfileCard key={town.id} community={town} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No communities have been documented for this LGA yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
