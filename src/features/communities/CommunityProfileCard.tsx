import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from '@/libs/I18nNavigation';

export interface CommunityProfileCardProps {
  community: {
    name: string;
    slug: string;
    lga: string;
    districtOrClan: string;
    historicalBackground?: string | null;
    languagesAndDialects?: unknown;
    status?: string;
  };
}

export const CommunityProfileCard = (props: CommunityProfileCardProps) => {
  const data = props.community;
  
  // Cleanly parse dialects array safely
  const dialects: Array<string> = Array.isArray(data.languagesAndDialects)
    ? (data.languagesAndDialects as Array<string>)
    : ['Owe Dialect', 'Okun Standard'];

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-emerald-500/30">
      {/* Absolute decorative accent node */}
      <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-emerald-500/10 to-amber-500/5 transition-transform duration-500 group-hover:scale-110" />

      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="emerald">{data.lga}</Badge>
          <span className="text-[11px] font-semibold tracking-wide text-gray-400 dark:text-gray-500">
            {data.districtOrClan}
          </span>
        </div>

        <h3 className="mt-4 font-serif text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400 sm:text-2xl">
          {data.name}
        </h3>

        <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-gray-600 dark:text-gray-300 sm:text-sm">
          {data.historicalBackground ||
            `Explore official archival documentation, origin lineages, traditional monarchy leadership structures, and public infrastructure registries for the community of ${data.name}.`}
        </p>

        {/* Dialect classifications array */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {dialects.map((d, i) => (
            <span
              key={String(i)}
              className="rounded-md bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-gray-200/60 ring-inset dark:bg-gray-800/50 dark:text-gray-400 dark:ring-gray-800"
            >
              🗣️ {d}
            </span>
          ))}
        </div>
      </div>

      {/* Button link footer action */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Link href={`/communities/${data.slug}/`} className="block w-full focus:outline-hidden">
          <Button variant="ghost" size="sm" className="w-full justify-between px-2 font-semibold">
            <span>Access Encyclopedia Registry</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
