import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/libs/DB';
import { communitiesSchema } from '@/models/Schema';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Crown, Star, AlertCircle } from 'lucide-react';

type DetailPageProps = { params: Promise<{ slug: string }> };
type TraditionalRulerItem = { title: string; name: string; isIncumbent?: boolean };
type IndigeneItem = { name: string; biography: string };
type CommunityViewData = {
  id: number; slug: string; name: string; lga: string; districtOrClan: string;
  historicalBackground: string | null;
  traditionalRulers?: TraditionalRulerItem[];
  indigenes?: IndigeneItem[];
  socialAmenitiesLacked?: unknown;
};

const staticData: Record<string, CommunityViewData> = {
  kabba: {
    id: 999, slug: 'kabba', name: 'Kabba (Owe)', lga: 'Kabba/Bunu', districtOrClan: 'Owe Clan',
    historicalBackground: 'Kabba serves as the core historical headquarters of the Okun people. Settled centuries ago by ancestral founders tracing lineage back to Ile-Ife migrations, it features prominent physical landmarks, highly celebrated cultural weaving festivals, and serves as the permanent seat of the paramount traditional monarchy, the Obaro of Kabba.',
    traditionalRulers: [{ title: 'Obaro of Kabba', name: 'Oba Solomon Dele Owoniyi', isIncumbent: true }],
    indigenes: [
      { name: 'Cardinal John Onaiyekan', biography: 'Archbishop Emeritus of Abuja Archdiocese and globally celebrated interfaith peace advocate.' },
      { name: 'Prof. Eyitayo Lambo', biography: 'Former Federal Minister of Health and international health systems economist.' },
    ],
    socialAmenitiesLacked: ['Advanced tertiary paediatric care units', 'Uninterrupted municipal water reticulation network'],
  },
  mopa: {
    id: 998, slug: 'mopa', name: 'Mopa', lga: 'Mopa-Muro', districtOrClan: 'Mopa Clan',
    historicalBackground: 'Mopa is a deeply progressive township known for early adoption of advanced mission schooling and robust civic self-help development frameworks initiated by native associations.',
    traditionalRulers: [{ title: 'Elulu of Mopa', name: 'Oba Julius Joledo', isIncumbent: true }],
    indigenes: [{ name: 'Chief Sunday Awoniyi', biography: 'Aro of Mopa and core national administrative icon during the early post-independence era.' }],
    socialAmenitiesLacked: ['Dedicated modern farm-to-market tarred bypasses', 'Standard localised industrial agro-processing plants'],
  },
  isanlu: {
    id: 997, slug: 'isanlu', name: 'Isanlu', lga: 'Yagba East', districtOrClan: 'Yagba Clan',
    historicalBackground: 'Serving as the administrative headquarters of Yagba East, Isanlu represents a major cultural crossroad defined by vibrant traditional masquerade rites, expansive fertile agricultural plains, and highly unified intra-clan governance structures.',
    traditionalRulers: [{ title: 'Agbana of Isanlu', name: 'Oba Moses Etombi', isIncumbent: true }],
    indigenes: [{ name: 'Pius Adesanmi', biography: 'Late globally renowned public intellectual, author, and professor of literature.' }],
    socialAmenitiesLacked: ['Standard secondary agro-allied storage terminals', 'High-voltage rural electrification sub-station upgrades'],
  },
  egbe: {
    id: 996, slug: 'egbe', name: 'Egbe', lga: 'Yagba West', districtOrClan: 'Yagba Clan',
    historicalBackground: 'Bordered by iconic rocky outcroppings, Egbe holds historical fame for hosting the earliest pioneer missionary hospital infrastructures in the western axis of Okunland.',
    traditionalRulers: [{ title: 'Elegbe of Egbe', name: 'Oba Ayodele Irukera', isIncumbent: true }],
    indigenes: [{ name: 'Babatunde Irukera', biography: 'Former Executive Vice Chairman of the Federal Competition and Consumer Protection Commission.' }],
    socialAmenitiesLacked: ['Expanded regional internal bypass routes', 'Continuous deep-well clean water distribution systems'],
  },
  iyara: {
    id: 995, slug: 'iyara', name: 'Iyara', lga: 'Ijumu', districtOrClan: 'Ijumu Clan',
    historicalBackground: 'The paramount municipal center of the Ijumu local government council, celebrated for excellent literacy outcomes, organised cooperative unions, and foundational traditional folklore.',
    traditionalRulers: [{ title: 'Eleta of Iyara', name: 'Oba Jacob Medutoye', isIncumbent: true }],
    indigenes: [{ name: 'Prof. David Irefin', biography: 'Eminent academic and international development economist.' }],
    socialAmenitiesLacked: ['Continuous internal municipal drainage channels', 'Upgraded secondary school science laboratory tools'],
  },
  'ekinrin-adde': {
    id: 994, slug: 'ekinrin-adde', name: 'Ekinrin-Adde', lga: 'Ijumu', districtOrClan: 'Ijumu Clan',
    historicalBackground: 'A deeply proactive twin-community renowned for self-funded infrastructural development, hosting the nationally acclaimed annual Ekinrin-Adde Day heritage carnivals, and maintaining an exceptionally active commercial diaspora.',
    traditionalRulers: [{ title: 'Olu Adde of Ekinrin-Adde', name: 'Oba Anthony Bamigbaiye Idowu', isIncumbent: true }],
    indigenes: [{ name: 'Chief Wole Olanipekun (SAN)', biography: 'Former President of the Nigerian Bar Association and leading national legal luminary.' }],
    socialAmenitiesLacked: ['High-capacity localised primary water treatment facilities', 'Dedicated solar-powered public street illumination nodes'],
  },
};

export async function generateMetadata(props: DetailPageProps) {
  const { slug } = await props.params;
  let records: Array<typeof communitiesSchema.$inferSelect> = [];
  try { records = await db.select().from(communitiesSchema).where(eq(communitiesSchema.slug, slug)); } catch { records = []; }
  const name = records[0]?.name ?? staticData[slug]?.name ?? (slug.charAt(0).toUpperCase() + slug.slice(1));
  return {
    title: `${name} — Heritage & Infrastructure Profile`,
    description: `Detailed documentation covering historical migration patterns, ancestral governance, paramount monarchs, and public amenity indexes for ${name}.`,
  };
}

function RulerCard(props: { ruler: TraditionalRulerItem }) {
  return (
    <li className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-900/40">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-bold text-gray-900 dark:text-white">{props.ruler.title}</span>
        {props.ruler.isIncumbent && <Badge variant="success" className="text-[10px]">Incumbent</Badge>}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">{props.ruler.name}</span>
    </li>
  );
}

function IndigeneCard(props: { indigene: IndigeneItem }) {
  return (
    <li className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-900/40">
      <span className="text-sm font-bold text-gray-900 dark:text-white">{props.indigene.name}</span>
      <span className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{props.indigene.biography}</span>
    </li>
  );
}

export default async function CommunityDetailPage(props: DetailPageProps) {
  const { slug } = await props.params;
  let records: Array<typeof communitiesSchema.$inferSelect> = [];
  try { records = await db.select().from(communitiesSchema).where(eq(communitiesSchema.slug, slug)); } catch { records = []; }

  let townData: CommunityViewData | null = null;
  if (records[0]) {
    const row = records[0];
    townData = { id: row.id, slug: row.slug, name: row.name, lga: row.lga, districtOrClan: row.districtOrClan, historicalBackground: row.historicalBackground, socialAmenitiesLacked: row.socialAmenitiesLacked };
  } else {
    townData = staticData[slug] ?? null;
  }

  if (!townData) notFound();

  const rulers = townData.traditionalRulers ?? [];
  const indigenesList = townData.indigenes ?? [];
  const lackedAmenities: string[] = Array.isArray(townData.socialAmenitiesLacked) ? townData.socialAmenitiesLacked.map(String) : [];

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
          <Badge variant="emerald">{townData.lga}</Badge>
          <Badge variant="amber">{townData.districtOrClan}</Badge>
        </div>
        <h1 className="relative z-10 mt-5 font-serif text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
          {townData.name}
        </h1>
        <div className="relative z-10 mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-amber-400 to-emerald-500" />
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900/60 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Historical Background</h2>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
            <p className="mt-5 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300 first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-emerald-700 dark:first-letter:text-emerald-400">
              {townData.historicalBackground ?? 'Historical documentation is currently being compiled.'}
            </p>
          </section>

          <section className="rounded-2xl border border-amber-500/25 bg-amber-50/40 p-6 dark:border-amber-500/15 dark:bg-amber-950/15 sm:p-8">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                <AlertCircle className="size-4" aria-hidden="true" />
              </div>
              <h2 className="font-serif text-base font-bold text-amber-900 dark:text-amber-300 sm:text-lg">Infrastructure Resource Gaps</h2>
            </div>
            <div className="mt-4 h-px bg-amber-200/50 dark:bg-amber-800/30" />
            {lackedAmenities.length > 0 ? (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2" role="list">
                {lackedAmenities.map((item, index) => (
                  <li key={String(index)} className="flex items-start gap-2.5 rounded-xl border border-amber-200/50 bg-white/70 px-3.5 py-2.5 text-sm text-amber-900 dark:border-amber-800/30 dark:bg-gray-900/40 dark:text-amber-300">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm italic text-amber-800/60 dark:text-amber-400/60">Civic parameters integration pending.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6" aria-label="Community highlights">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
            <h2 className="flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              <Crown className="size-4 text-amber-500" aria-hidden="true" />
              Paramount Monarchy
            </h2>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
            {rulers.length > 0 ? (
              <ul className="mt-4 space-y-3" role="list">{rulers.map((r, i) => <RulerCard key={String(i)} ruler={r} />)}</ul>
            ) : (
              <p className="mt-3 text-sm italic text-gray-400">Traditional records currently synchronising.</p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
            <h2 className="flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              <Star className="size-4 text-emerald-500" aria-hidden="true" />
              Prominent Indigenes
            </h2>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />
            {indigenesList.length > 0 ? (
              <ul className="mt-4 space-y-3" role="list">{indigenesList.map((ind, i) => <IndigeneCard key={String(i)} indigene={ind} />)}</ul>
            ) : (
              <p className="mt-3 text-sm italic text-gray-400">Elders directory caching state.</p>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
