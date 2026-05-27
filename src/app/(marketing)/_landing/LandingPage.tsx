import {
  BookOpen,
  Map,
  Newspaper,
  ArrowRight,
  Users,
  Landmark,
  ScrollText,
  Globe,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { ScrollRevealWrapper } from '@/components/ScrollRevealWrapper';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// ── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  {
    val: '6',
    label: 'Local Government Areas',
    icon: Globe,
    color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40',
  },
  {
    val: '80+',
    label: 'Documented Communities',
    icon: Users,
    color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40',
  },
  {
    val: '6+',
    label: 'Paramount Monarchies',
    icon: Landmark,
    color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40',
  },
  {
    val: 'Centuries',
    label: 'Of Migration Narratives',
    icon: ScrollText,
    color: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/40',
  },
];

const features = [
  {
    icon: BookOpen,
    title: 'Community Encyclopedia',
    description:
      'In-depth profiles spanning founding folklore, clan boundaries, prominent leadership, and civic infrastructure across all Okun towns.',
    href: '/communities',
    cta: 'Browse Communities',
    accent: 'emerald',
  },
  {
    icon: Map,
    title: 'Interactive GIS Map',
    description:
      'Geospatial explorer charting indigenous terrain boundaries, district coordinates, and visual proximity maps of the Okun region.',
    href: '/map',
    cta: 'Open Atlas',
    accent: 'amber',
  },
  {
    icon: Newspaper,
    title: 'Publications & News',
    description:
      'Archival updates covering community outreach, heritage symposiums, and curated civic announcements from across Okunland.',
    href: '/blog',
    cta: 'Read Dispatches',
    accent: 'blue',
  },
] as const;

const accentMap = {
  emerald: {
    icon: 'bg-emerald-50 text-emerald-600 ring-emerald-600/10 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950/40 dark:text-emerald-400 dark:group-hover:bg-emerald-500',
    title: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-400',
    border: 'hover:border-emerald-400/50 dark:hover:border-emerald-500/30',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600 ring-amber-600/10 group-hover:bg-amber-600 group-hover:text-white dark:bg-amber-950/40 dark:text-amber-400 dark:group-hover:bg-amber-500',
    title: 'group-hover:text-amber-700 dark:group-hover:text-amber-400',
    border: 'hover:border-amber-400/50 dark:hover:border-amber-500/30',
  },
  blue: {
    icon: 'bg-blue-50 text-blue-600 ring-blue-600/10 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/40 dark:text-blue-400 dark:group-hover:bg-blue-500',
    title: 'group-hover:text-blue-700 dark:group-hover:text-blue-400',
    border: 'hover:border-blue-400/50 dark:hover:border-blue-500/30',
  },
};

const popularTowns = ['Kabba', 'Isanlu', 'Mopa', 'Egbe', 'Iyara', 'Ekinrin-Adde'];

const lgas = [
  { name: 'Kabba/Bunu', slug: 'kabba-bunu', info: 'Headquarters: Kabba · Owe, Bunu & Kiri clans' },
  { name: 'Ijumu', slug: 'ijumu', info: 'Headquarters: Iyara · Gbede & Ijumu clans' },
  { name: 'Mopa-Muro', slug: 'mopa-muro', info: 'Headquarters: Mopa · Yagba clans' },
  { name: 'Yagba West', slug: 'yagba-west', info: 'Headquarters: Odo-Ere · Yagba clans' },
  { name: 'Yagba East', slug: 'yagba-east', info: 'Headquarters: Isanlu · Yagba clans' },
  { name: 'Lokoja (Oworo)', slug: 'lokoja', info: 'Headquarters: Lokoja · Oworo clan' },
];

const clans = [
  { name: 'Bunu', slug: 'bunu', desc: 'Sparsely populated agricultural region with rich lineages' },
  { name: 'Owe', slug: 'owe', desc: 'Centered around Kabba, historic provincial hub' },
  { name: 'Oworo', slug: 'oworo', desc: 'Easternmost Okun group along the Niger Confluence' },
  { name: 'Ijumu', slug: 'ijumu', desc: 'Rich historic settlements in southern hills' },
  { name: 'Kiri', slug: 'kiri', desc: 'Lineages nestled in Bunu highland ridges' },
  { name: 'Gbede', slug: 'gbede', desc: 'Northern Ijumu region with unique dialects' },
  { name: 'Yagba', slug: 'yagba', desc: 'The largest dialectal group in western hills' },
];

// ── Component ────────────────────────────────────────────────────────────────

export function LandingPage() {
  return (
    <div className="space-y-20">
      {/* ── Hero ── */}
      <ScrollRevealWrapper
        tagName="section"
        mode="children"
        immediate={true}
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-950 via-gray-900 to-amber-950 px-6 py-16 text-white shadow-2xl sm:px-12 lg:px-20 lg:py-24"
      >
        {/* Ambient glows */}
        <div
          className="absolute top-0 left-1/4 size-96 rounded-full bg-emerald-500/8 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute right-1/4 bottom-0 size-96 rounded-full bg-amber-500/8 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Badge — fades in first */}
          <div className="animate-on-scroll fade-in-only stagger-1 mb-6 inline-flex items-center gap-2">
            <Badge variant="amber" className="px-3 py-1.5 text-xs backdrop-blur-sm">
              <span
                className="flex size-1.5 animate-pulse rounded-full bg-amber-400"
                aria-hidden="true"
              />
              Digital Archival Platform · Okun People & Heritage
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="animate-on-scroll stagger-2 max-w-5xl font-serif text-3xl leading-tight font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
            A Living Digital Archive of{' '}
            <span className="bg-linear-to-r from-emerald-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
              Okun History, Culture, Communities & Heritage
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-on-scroll stagger-3 mx-auto mt-6 max-w-3xl text-base leading-relaxed text-pretty text-slate-300 sm:text-lg lg:text-xl dark:text-slate-400">
            Explore the rich history and cultural heritage of Okunland, learn about notable
            indigenes and traditional institutions, and connect with people who share your roots.
          </p>

          {/* Search form */}
          <div className="animate-on-scroll stagger-4 mx-auto mt-10 max-w-xl">
            <form
              action="/communities/"
              method="GET"
              className="flex items-center gap-2 rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/20 backdrop-blur-md transition-shadow duration-300 focus-within:ring-2 focus-within:ring-amber-400/70"
            >
              <input
                type="text"
                name="search"
                placeholder="Search communities, towns, or traditional titles..."
                className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-hidden"
                aria-label="Search Okunpedia"
              />
              <Button type="submit" variant="accent" size="md" className="shrink-0">
                Search
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </form>

            {/* Quick links */}
            <div className="animate-on-scroll stagger-5 mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
              <span className="font-medium">Popular:</span>
              {popularTowns.map((town) => (
                <Link
                  key={town}
                  href={`/communities/${town.toLowerCase().replace(' ', '-')}/`}
                  className="rounded-lg bg-white/8 px-2.5 py-1 font-medium transition-colors duration-200 hover:bg-white/15 hover:text-white"
                >
                  {town}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollRevealWrapper>

      {/* ── Feature cards ── */}
      <ScrollRevealWrapper
        tagName="section"
        mode="children"
        threshold={0.08}
        aria-label="Platform features"
      >
        <div className="animate-on-scroll mb-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            Explore Okunpedia
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Three integrated modules for comprehensive heritage discovery.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => {
            const theme = accentMap[feature.accent];
            return (
              <div
                key={feature.title}
                className={`animate-on-scroll stagger-${i + 2} group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/60 ${theme.border}`}
              >
                <div>
                  <div
                    className={`mb-4 inline-flex rounded-xl p-3 ring-1 transition-all duration-300 ring-inset ${theme.icon}`}
                  >
                    <feature.icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3
                    className={`font-serif text-lg font-bold text-gray-900 transition-colors dark:text-white ${theme.title}`}
                  >
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
                  <Link href={feature.href} className="block focus:outline-hidden">
                    <Button variant="ghost" size="sm" className="w-full justify-between px-1">
                      <span>{feature.cta}</span>
                      <ArrowRight
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollRevealWrapper>

      {/* ── LGAs & Clans Heritage ── */}
      <ScrollRevealWrapper
        tagName="section"
        mode="children"
        threshold={0.08}
        aria-label="Okun LGAs and Clans"
      >
        <div className="animate-on-scroll mb-10 text-center">
          <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            Clans & Local Government Areas
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Discover the rich historical administrative and dialectal divisions of Okunland.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* LGAs Column */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-gray-900 dark:text-white">
              <Landmark className="size-5 text-emerald-600 dark:text-emerald-400" />6 Local
              Government Areas (LGAs)
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {lgas.map((lga, i) => (
                <Link
                  key={lga.slug}
                  href={`/lgas/${lga.slug}`}
                  className={`animate-on-scroll stagger-${i + 1} group flex flex-col justify-between rounded-xl border border-gray-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/50 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60`}
                >
                  <div>
                    <h4 className="font-serif text-base font-bold text-gray-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                      {lga.name}
                    </h4>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{lga.info}</p>
                  </div>
                  <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:underline dark:text-emerald-400">
                    View Profile
                    <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Clans Column */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-gray-900 dark:text-white">
              <Shield className="size-5 text-amber-600 dark:text-amber-400" />7 Dialectal Clans
              (Tribes)
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {clans.map((clan, i) => (
                <Link
                  key={clan.slug}
                  href={`/clans/${clan.slug}`}
                  className={`animate-on-scroll stagger-${i + 1} group flex flex-col justify-between rounded-xl border border-gray-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/50 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60`}
                >
                  <div>
                    <h4 className="font-serif text-base font-bold text-gray-900 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400">
                      {clan.name}
                    </h4>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{clan.desc}</p>
                  </div>
                  <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-700 group-hover:underline dark:text-amber-400">
                    Explore lineage
                    <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollRevealWrapper>

      {/* ── Stats ── */}
      <ScrollRevealWrapper
        tagName="section"
        mode="children"
        threshold={0.08}
        aria-label="Platform statistics"
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`animate-on-scroll scale stagger-${i + 1} group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60`}
            >
              <div className={`inline-flex rounded-xl p-2.5 ${stat.color}`}>
                <stat.icon className="size-5" aria-hidden="true" />
              </div>
              <div>
                <div className="font-serif text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                  {stat.val}
                </div>
                <div className="mt-1 text-xs font-medium text-gray-500 sm:text-sm dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollRevealWrapper>

      {/* ── Mission strip ── */}
      <ScrollRevealWrapper
        tagName="section"
        mode="self"
        threshold={0.12}
        className="animate-on-scroll rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 to-amber-50/30 p-8 dark:border-emerald-500/15 dark:from-emerald-950/30 dark:to-amber-950/20"
      >
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="emerald" className="mb-4">
            Our Mission
          </Badge>
          <h2 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
            Zero historical attrition of Okun heritage
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Okunpedia is a civic initiative committed to ensuring the oral traditions, dialectical
            folklore, migration narratives, and municipal records of the Okun people are preserved,
            authenticated, and made freely accessible — forever.
          </p>
          <div className="mt-6">
            <Link href="/about" className="focus:outline-hidden">
              <Button variant="outline" size="md">
                Learn about this project
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </ScrollRevealWrapper>
    </div>
  );
}
