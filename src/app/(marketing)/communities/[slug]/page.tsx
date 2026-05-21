import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/libs/DB';
import { townTable, lgaTable, prominentPersonTable } from '@/models/Schema';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Crown, Star, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

type DetailPageProps = { params: Promise<{ slug: string }> };

type RulerItem = { title: string; name: string };
type IndigeneItem = { name: string; biography: string };

export async function generateMetadata(props: DetailPageProps) {
  const { slug } = await props.params;
  const rows = await db
    .select({ name: townTable.name })
    .from(townTable)
    .where(eq(townTable.slug, slug))
    .limit(1);
  const name = rows[0]?.name ?? (slug.charAt(0).toUpperCase() + slug.slice(1));
  return {
    title: `${name} — Heritage & Infrastructure Profile`,
    description: `Detailed documentation covering historical migration patterns, ancestral governance, paramount monarchs, and public amenity indexes for ${name}.`,
  };
}

export default async function CommunityDetailPage(props: DetailPageProps) {
  const { slug } = await props.params;

  // Fetch town joined with LGA
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
    })
    .from(townTable)
    .innerJoin(lgaTable, eq(townTable.lgaId, lgaTable.id))
    .where(eq(townTable.slug, slug))
    .limit(1);

  const town = townRows[0];
  if (!town) notFound();

  // Fetch prominent persons for this town
  const persons = await db
    .select({
      id: prominentPersonTable.id,
      name: prominentPersonTable.name,
      title: prominentPersonTable.title,
      biography: prominentPersonTable.biography,
    })
    .from(prominentPersonTable)
    .where(eq(prominentPersonTable.townId, town.id));

  const rulers: RulerItem[] = town.rulerTitle && town.traditionalRuler
    ? [{ title: town.rulerTitle, name: town.traditionalRuler }]
    : [];

  const indigenes: IndigeneItem[] = persons
    .filter((p) => p.biography)
    .map((p) => ({ name: p.name, biography: p.biography ?? '' }));

  const districtOrClan = town.tagline ?? `${town.lga} LGA`;

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

      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-gray-900 to-amber-950 px-8 py-14 text-white shadow-xl sm:px-14 md:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" aria-hidden="true" />
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <Badge variant="emerald">{town.lga}</Badge>
          <Badge variant="amber">{districtOrClan}</Badge>
        </div>
        <h1 className="relative z-10 mt-5 font-serif text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
          {town.name}
        </h1>
        <div className="relative z-10 mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-amber-400 to-emerald-500" />

        {/* Stats row */}
        {(town.population ?? town.founded) && (
          <div className="relative z-10 mt-6 flex flex-wrap gap-4 text-sm text-gray-300">
            {town.population && (
              <span>
                <span className="font-semibold text-white">{town.population.toLocaleString()}</span> estimated population
              </span>
            )}
            {town.founded && (
              <span>
                Founded <span className="font-semibold text-white">{town.founded}</span>
              </span>
            )}
          </div>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Historical overview */}
          <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900/60 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Historical Background</h2>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
            <p className="mt-5 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300 first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-emerald-700 dark:first-letter:text-emerald-400">
              {town.overview}
            </p>
          </section>

          {/* Random facts */}
          {Array.isArray(town.randomFacts) && town.randomFacts.length > 0 && (
            <section className="rounded-2xl border border-amber-500/25 bg-amber-50/40 p-6 dark:border-amber-500/15 dark:bg-amber-950/15 sm:p-8">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                  <AlertCircle className="size-4" aria-hidden="true" />
                </div>
                <h2 className="font-serif text-base font-bold text-amber-900 dark:text-amber-300 sm:text-lg">
                  Notable Facts
                </h2>
              </div>
              <div className="mt-4 h-px bg-amber-200/50 dark:bg-amber-800/30" />
              <ul className="mt-4 grid gap-2 sm:grid-cols-2" role="list">
                {town.randomFacts.map((fact, i) => (
                  <li
                    key={String(i)}
                    className="flex items-start gap-2.5 rounded-xl border border-amber-200/50 bg-white/70 px-3.5 py-2.5 text-sm text-amber-900 dark:border-amber-800/30 dark:bg-gray-900/40 dark:text-amber-300"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                    {fact}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6" aria-label="Community highlights">
          {/* Traditional ruler */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
            <h2 className="flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              <Crown className="size-4 text-amber-500" aria-hidden="true" />
              Paramount Monarchy
            </h2>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
            {rulers.length > 0 ? (
              <ul className="mt-4 space-y-3" role="list">
                {rulers.map((r, i) => (
                  <li key={String(i)} className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-900/40">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{r.title}</span>
                      <Badge variant="success" className="text-[10px]">Incumbent</Badge>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{r.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm italic text-gray-400">Traditional records currently synchronising.</p>
            )}
          </div>

          {/* Prominent indigenes */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
            <h2 className="flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              <Star className="size-4 text-emerald-500" aria-hidden="true" />
              Prominent Indigenes
            </h2>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
            {indigenes.length > 0 ? (
              <ul className="mt-4 space-y-3" role="list">
                {indigenes.map((ind, i) => (
                  <li key={String(i)} className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-900/40">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{ind.name}</span>
                    <span className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{ind.biography}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm italic text-gray-400">Elders directory caching state.</p>
            )}
          </div>

          {/* Coordinates */}
          {(town.lat && town.lng) && (
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
              <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
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
    </article>
  );
}
