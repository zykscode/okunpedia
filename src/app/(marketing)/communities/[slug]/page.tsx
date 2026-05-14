import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { db } from '@/libs/DB';
import { Link } from '@/libs/I18nNavigation';
import { communitiesSchema } from '@/models/Schema';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type DetailPageProps = {
  params: Promise<{ slug: string }>;
};

type TraditionalRulerItem = {
  title: string;
  name: string;
  isIncumbent?: boolean;
};

type IndigeneItem = {
  name: string;
  biography: string;
};

type CommunityViewData = {
  id: number;
  slug: string;
  name: string;
  lga: string;
  districtOrClan: string;
  historicalBackground: string | null;
  traditionalRulers?: TraditionalRulerItem[];
  indigenes?: IndigeneItem[];
  socialAmenitiesLacked?: unknown;
};

export async function generateMetadata(props: DetailPageProps) {
  const params = await props.params;
  const slug = params.slug;

  let records: Array<typeof communitiesSchema.$inferSelect> = [];
  try {
    records = await db.select().from(communitiesSchema).where(eq(communitiesSchema.slug, slug));
  } catch {
    records = [];
  }
  const [record] = records;

  const name = record ? record.name : slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `${name} Community Heritage - Lineage & Infrastructure Profile`,
    description: `Definitive documentation detailing historical migration patterns, ancestral governance, paramount monarchs, and public amenity indexes for ${name}.`,
  };
}

export default async function CommunityDetailPage(props: DetailPageProps) {
  const params = await props.params;
  const slug = params.slug;

  let records: Array<typeof communitiesSchema.$inferSelect> = [];
  try {
    records = await db.select().from(communitiesSchema).where(eq(communitiesSchema.slug, slug));
  } catch {
    records = [];
  }
  const [dbTown] = records;

  let townData: CommunityViewData | null = null;

  if (dbTown) {
    townData = {
      id: dbTown.id,
      slug: dbTown.slug,
      name: dbTown.name,
      lga: dbTown.lga,
      districtOrClan: dbTown.districtOrClan,
      historicalBackground: dbTown.historicalBackground,
      socialAmenitiesLacked: dbTown.socialAmenitiesLacked,
    };
  } else if (slug === 'kabba') {
    townData = {
      id: 999,
      slug: 'kabba',
      name: 'Kabba (Owe)',
      lga: 'Kabba/Bunu',
      districtOrClan: 'Owe Clan',
      historicalBackground:
        'Kabba serves as the core historical headquarters of the Okun people. Settled centuries ago by ancestral founders tracing lineage back to Ile-Ife migrations, it features prominent physical landmarks, highly celebrated cultural weaving festivals, and serves as the permanent seat of the paramount traditional monarchy, the Obaro of Kabba.',
      traditionalRulers: [
        { title: 'Obaro of Kabba', name: 'Oba Solomon Dele Owoniyi', isIncumbent: true },
      ],
      indigenes: [
        {
          name: 'Cardinal John Onaiyekan',
          biography:
            'Archbishop Emeritus of Abuja Archdiocese and globally celebrated interfaith peace advocate.',
        },
        {
          name: 'Prof. Eyitayo Lambo',
          biography:
            'Former Federal Minister of Health and international health systems economist.',
        },
      ],
      socialAmenitiesLacked: [
        'Advanced tertiary pediatric care units',
        'Uninterrupted municipal water reticulation network',
      ],
    };
  } else if (slug === 'mopa') {
    townData = {
      id: 998,
      slug: 'mopa',
      name: 'Mopa',
      lga: 'Mopa-Muro',
      districtOrClan: 'Mopa Clan',
      historicalBackground:
        'Mopa is a deeply progressive township known for early adoption of advanced mission schooling and robust civic self-help development frameworks initiated by native associations.',
      traditionalRulers: [{ title: 'Elulu of Mopa', name: 'Oba Julius Joledo', isIncumbent: true }],
      indigenes: [
        {
          name: 'Chief Sunday Awoniyi',
          biography:
            'Aro of Mopa and core national administrative icon during the early post-independence era.',
        },
      ],
      socialAmenitiesLacked: [
        'Dedicated modern farm-to-market tarred bypasses',
        'Standard localized industrial agro-processing plants',
      ],
    };
  } else if (slug === 'isanlu') {
    townData = {
      id: 997,
      slug: 'isanlu',
      name: 'Isanlu',
      lga: 'Yagba East',
      districtOrClan: 'Yagba Clan',
      historicalBackground:
        'Serving as the administrative headquarters of Yagba East, Isanlu represents a major cultural crossroad defined by vibrant traditional masquerade rites, expansive fertile agricultural plains, and highly unified intra-clan governance structures.',
      traditionalRulers: [
        { title: 'Agbana of Isanlu', name: 'Oba Moses Etombi', isIncumbent: true },
      ],
      indigenes: [
        {
          name: 'Pius Adesanmi',
          biography:
            'Late globally renowned public intellectual, author, and professor of literature.',
        },
      ],
      socialAmenitiesLacked: [
        'Standard secondary agro-allied storage terminals',
        'High-voltage rural electrification sub-station upgrades',
      ],
    };
  } else if (slug === 'egbe') {
    townData = {
      id: 996,
      slug: 'egbe',
      name: 'Egbe',
      lga: 'Yagba West',
      districtOrClan: 'Yagba Clan',
      historicalBackground:
        'Bordered by iconic rocky outcroppings, Egbe holds historical fame for hosting the earliest pioneer missionary hospital infrastructures in the western axis of Okunland, turning it into a lasting regional medical referral hub.',
      traditionalRulers: [
        { title: 'Elegbe of Egbe', name: 'Oba Ayodele Irukera', isIncumbent: true },
      ],
      indigenes: [
        {
          name: 'Babatunde Irukera',
          biography:
            'Former Executive Vice Chairman of the Federal Competition and Consumer Protection Commission.',
        },
      ],
      socialAmenitiesLacked: [
        'Expanded regional internal bypass routes',
        'Continuous deep-well clean water distribution systems',
      ],
    };
  } else if (slug === 'iyara') {
    townData = {
      id: 995,
      slug: 'iyara',
      name: 'Iyara',
      lga: 'Ijumu',
      districtOrClan: 'Ijumu Clan',
      historicalBackground:
        'The paramount municipal center of the Ijumu local government council, celebrated for excellent literacy outcomes, organized cooperative unions, and foundational traditional folklore.',
      traditionalRulers: [
        { title: 'Eleta of Iyara', name: 'Oba Jacob Medutoye', isIncumbent: true },
      ],
      indigenes: [
        {
          name: 'Prof. David Irefin',
          biography: 'Eminent academic and international development economist.',
        },
      ],
      socialAmenitiesLacked: [
        'Continuous internal municipal drainage channels',
        'Upgraded standardized secondary school science laboratory tools',
      ],
    };
  } else if (slug === 'ekinrin-adde') {
    townData = {
      id: 994,
      slug: 'ekinrin-adde',
      name: 'Ekinrin-Adde',
      lga: 'Ijumu',
      districtOrClan: 'Ijumu Clan',
      historicalBackground:
        'A deeply proactive twin-community renowned for self-funded infrastructural development, hosting the nationally acclaimed annual Ekinrin-Adde Day heritage carnivals, and maintaining an exceptionally active commercial diaspora.',
      traditionalRulers: [
        {
          title: 'Olu Adde of Ekinrin-Adde',
          name: 'Oba Anthony Bamigbaiye Idowu',
          isIncumbent: true,
        },
      ],
      indigenes: [
        {
          name: 'Chief Wole Olanipekun (SAN)',
          biography:
            'Former President of the Nigerian Bar Association and leading national legal luminary.',
        },
      ],
      socialAmenitiesLacked: [
        'High-capacity localized primary water treatment storage facilities',
        'Dedicated solar-powered public street illumination nodes',
      ],
    };
  }

  if (!townData) {
    notFound();
  }

  const rulers = townData.traditionalRulers ?? [];
  const indigenesList = townData.indigenes ?? [];

  let lackedAmenities: string[] = [];
  if (Array.isArray(townData.socialAmenitiesLacked)) {
    lackedAmenities = townData.socialAmenitiesLacked.map(String);
  }

  return (
    <article className="mx-auto max-w-5xl space-y-8 py-6">
      {/* Return Navigation Chip Bar */}
      <div>
        <Link href="/communities/" className="inline-block focus:outline-hidden">
          <Button variant="outline" size="sm" className="gap-2">
            <span>&larr;</span>
            <span>Back to Complete Index</span>
          </Button>
        </Link>
      </div>

      {/* Cinematic National Geographic Hero Heading Architecture */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-gray-900 to-amber-950 p-8 text-white shadow-xl dark:from-gray-950 dark:via-black dark:to-emerald-950 sm:p-14 md:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Badge variant="emerald">{townData.lga}</Badge>
          <Badge variant="amber">{townData.districtOrClan}</Badge>
        </div>

        <h1 className="relative z-10 mt-6 font-serif text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
          {townData.name}
        </h1>

        <div className="relative z-10 mt-6 h-1 w-24 bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full" />
      </header>

      {/* Multi-Column Editorial Layout Body */}
      <div className="grid gap-10 lg:grid-cols-3">
        {/* Main Monograph Left Space (2 Columns width) */}
        <div className="space-y-10 lg:col-span-2">
          <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900/60 sm:p-8">
            <h2 className="font-serif text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              Historical Background & Migration Narrative
            </h2>
            <div className="mt-4 h-px bg-gray-100 dark:bg-gray-800" />
            <p className="mt-5 text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300 first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-emerald-700 dark:first-letter:text-emerald-400">
              {townData.historicalBackground ?? 'Historical document archiving compilation active.'}
            </p>
          </section>

          {/* Development Deficits Matrix */}
          <section className="rounded-2xl border border-amber-500/30 bg-amber-50/30 p-6 dark:border-amber-500/20 dark:bg-amber-950/20 sm:p-8">
            <div className="flex items-center gap-2">
              <Badge variant="amber">Infrastructure Report</Badge>
              <h3 className="font-serif text-base font-bold text-amber-950 dark:text-amber-400 sm:text-lg">
                Municipal Resource Gaps
              </h3>
            </div>
            
            <div className="mt-4 h-px bg-amber-200/40 dark:bg-amber-800/40" />

            {lackedAmenities.length > 0 ? (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {lackedAmenities.map((item, index) => (
                  <li
                    key={String(index)}
                    className="flex items-center gap-2 rounded-xl border border-amber-200/40 bg-white/60 px-3 py-2 text-xs font-medium text-amber-900 dark:border-amber-800/40 dark:bg-gray-900/40 dark:text-amber-300"
                  >
                    <span className="size-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-xs italic text-amber-800/70 dark:text-amber-400/70">
                Civic parameters integration pending index clearance.
              </p>
            )}
          </section>
        </div>

        {/* Sidebar Wing: Monarchies & Indigenous Heritage List */}
        <aside className="space-y-6">
          {/* Section: Traditional Rulers */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              👑 Paramount Monarchy
            </h3>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />

            {rulers.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {rulers.map((ruler, i) => (
                  <li key={String(i)} className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {ruler.title}
                      </span>
                      {ruler.isIncumbent && (
                        <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {ruler.name}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs italic text-gray-400">
                Traditional records currently synchronizing.
              </p>
            )}
          </div>

          {/* Section: Prominent Indigenes */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              ✨ Prominent Indigenes
            </h3>
            <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />

            {indigenesList.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {indigenesList.map((ind, i) => (
                  <li key={String(i)} className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {ind.name}
                    </span>
                    <span className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
                      {ind.biography}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs italic text-gray-400">
                Elders directory pipeline caching state.
              </p>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
