import Image from 'next/image';
import logo from '../../../public/logo.png';

type LoadingVariant = 'fullscreen' | 'page' | 'section' | 'inline';

type LoadingScreenProps = {
  /**
   * Controls the size and layout of the loader:
   * - `fullscreen` — covers the entire viewport (fixed overlay)
   * - `page`       — fills the remaining page height (min-h-[60vh])
   * - `section`    — fits inside a content section (min-h-[200px])
   * - `inline`     — small inline spinner with logo, no vertical padding
   */
  variant?: LoadingVariant;
  /** Optional label shown below the logo. */
  label?: string;
};

const VARIANT_WRAPPER: Record<LoadingVariant, string> = {
  fullscreen: 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-gray-950/90',
  page:       'flex min-h-[60vh] flex-col items-center justify-center py-16',
  section:    'flex min-h-[200px] flex-col items-center justify-center py-10',
  inline:     'inline-flex items-center gap-3',
};

const LOGO_SIZE: Record<LoadingVariant, number> = {
  fullscreen: 56,
  page:       48,
  section:    36,
  inline:     24,
};

/**
 * Branded loading indicator using the Okunpedia logo as the animated mark.
 * Use `variant` to slot it into fullscreen overlays, page transitions, sections, or inline contexts.
 */
export function LoadingScreen(props: LoadingScreenProps) {
  const variant = props.variant ?? 'page';
  const logoSize = LOGO_SIZE[variant];
  const isInline = variant === 'inline';
  const label = props.label ?? (isInline ? 'Loading…' : 'Loading');

  return (
    <div className={VARIANT_WRAPPER[variant]} role="status" aria-label={label}>
      <div className={`relative flex items-center justify-center ${isInline ? '' : 'mb-4'}`}>
        {/* Spinning orbit ring */}
        <span
          style={{ width: logoSize * 2, height: logoSize * 2 }}
          className="absolute animate-spin rounded-full border-2 border-transparent border-t-emerald-500 border-r-emerald-300/40"
        />

        {/* Secondary slower ring */}
        {!isInline && (
          <span
            style={{ width: logoSize * 1.55, height: logoSize * 1.55 }}
            className="absolute animate-spin rounded-full border border-transparent border-b-emerald-400/30"
          />
        )}

        {/* Logo mark */}
        <div
          style={{ width: logoSize, height: logoSize }}
          className="relative flex items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
        >
          <Image
            src={logo}
            alt="Okunpedia"
            width={logoSize}
            height={logoSize}
            className="rounded-full"
            priority
          />
        </div>
      </div>

      {/* Label */}
      {!isInline && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</p>
          {/* Subtle dot trail */}
          <div className="mt-1 flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{ animationDelay: `${i * 0.15}s` }}
                className="size-1 animate-pulse rounded-full bg-emerald-500/60"
              />
            ))}
          </div>
        </div>
      )}

      {/* Inline label */}
      {isInline && (
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      )}
    </div>
  );
}
