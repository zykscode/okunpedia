import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "lucide-react";
import { getClanSlug } from "@/utils/clanMatcher";

/**
 * Type for community data displayed in cards.
 */
export type CommunityProfileCardProps = {
  community: {
    name: string;
    slug: string;
    lga: string;
    districtOrClan: string;
    historicalBackground?: string | null;
    languagesAndDialects?: unknown;
    status?: string;
  };
};

/**
 * Card displaying a community summary with name, LGA, historical context, and navigation link.
 * @param props Props containing the community object to render.
 * @returns React node representing the community card.
 */
export const CommunityProfileCard = (props: CommunityProfileCardProps) => {
  const data = props.community;

  const lgaSlug = data.lga
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/gu, "-")
    .replaceAll(/(^-|-$)/gu, "");
  const clanSlug = getClanSlug({
    districtOrClan: data.districtOrClan,
    lgaName: data.lga,
    townName: data.name,
    overview: data.historicalBackground,
  });

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/50 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-emerald-500/30">
      {/* Decorative corner gradient */}
      <div
        className="pointer-events-none absolute top-0 right-0 size-28 rounded-bl-full bg-linear-to-br from-emerald-500/8 to-amber-500/5 transition-transform duration-500 group-hover:scale-110"
        aria-hidden="true"
      />

      <div className="p-6">
        {/* Meta row */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/lgas/${lgaSlug}`}
            className="hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <Badge variant="emerald">{data.lga} LGA</Badge>
          </Link>
          {clanSlug ? (
            <Link
              href={`/clans/${clanSlug}`}
              className="text-xs capitalize font-semibold text-amber-700 dark:text-amber-400 hover:underline"
            >
              {data.districtOrClan}
            </Link>
          ) : (
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
              {data.districtOrClan}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-4 font-serif text-xl capitalize font-bold tracking-tight text-gray-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400 sm:text-2xl">
          {data.name}
        </h3>

        {/* Excerpt */}
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {data.historicalBackground ||
            `Explore official archival documentation, origin lineages, traditional monarchy leadership, and public infrastructure registries for ${data.name}.`}
        </p>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800">
        <Link
          href={`/communities/${data.slug}/`}
          className="flex items-center justify-between text-sm font-semibold text-emerald-700 no-underline transition-colors hover:text-emerald-600 focus:outline-hidden dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          <span>View community profile</span>
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
};
