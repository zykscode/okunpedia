import Image from 'next/image';
import logo from '../../../public/logo.png';

type ComingSoonProps = {
  /** Main heading. Defaults to "Coming Soon". */
  title?: string;
  /** Supporting message shown below the heading. */
  message?: string;
  /** Optional feature/section name shown as a label above the heading. */
  featureName?: string;
};

/**
 * Full-page placeholder for features that are not yet available.
 * Drop it into any route as a temporary stand-in.
 */
export function ComingSoon(props: ComingSoonProps) {
  const title = props.title ?? 'Coming Soon';
  const message =
    props.message ??
    'This feature is currently being crafted. Check back soon — something great is on the way.';

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      {/* Animated logo */}
      <div className="relative mb-8">
        {/* Outer glow ring */}
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
        <div className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-lg ring-1 ring-emerald-200 dark:from-emerald-950/60 dark:to-emerald-900/40 dark:ring-emerald-800/60">
          <Image
            src={logo}
            alt="Okunpedia"
            width={48}
            height={48}
            className="rounded-full"
            priority
          />
        </div>
      </div>

      {/* Feature label */}
      {props.featureName && (
        <span className="mb-3 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold tracking-widest text-emerald-700 uppercase ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/50">
          {props.featureName}
        </span>
      )}

      {/* Heading */}
      <h1 className="font-serif text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        {title}
      </h1>

      {/* Decorative dots */}
      <div className="my-4 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 0.2}s` }}
            className="size-1.5 animate-bounce rounded-full bg-emerald-500"
          />
        ))}
      </div>

      {/* Message */}
      <p className="max-w-md text-base leading-relaxed text-gray-500 dark:text-gray-400">
        {message}
      </p>

      {/* Decorative card strip */}
      <div className="mt-10 flex gap-2 opacity-30">
        {[40, 64, 48, 72, 40].map((w, i) => (
          <div
            key={i}
            style={{ width: w }}
            className="h-2 rounded-full bg-gray-400 dark:bg-gray-600"
          />
        ))}
      </div>
    </div>
  );
}
