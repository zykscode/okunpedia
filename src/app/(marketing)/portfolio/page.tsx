import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/libs/I18nNavigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import sentryLogo from '@/public/assets/images/sentry-dark.png';

export const metadata: Metadata = {
  title: 'Archival Portfolio - Curated Collections',
  description: 'Specialized photographic records and visual heritage snapshots across documented communities.',
};

export default function Portfolio() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <div className="border-b border-gray-200 pb-6 dark:border-gray-800">
        <Badge variant="blue">Visual Heritage</Badge>
        <h1 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Curated Visual Artifacts
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Explore structured archival photography and mapping charts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={String(i)}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-emerald-500/30"
          >
            <div>
              <span className="font-serif text-base font-bold text-gray-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                Artifact Showcase #{i + 1}
              </span>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Visual capture frame preserving regional architecture and geographical plots.
              </p>
            </div>
            
            <div className="mt-6 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Link href={`/portfolio/${i}`} className="block focus:outline-hidden">
                <Button variant="ghost" size="sm" className="w-full justify-between px-1 text-emerald-700 dark:text-emerald-400">
                  <span>View Details</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-gray-100 pt-8 text-center text-xs sm:text-sm dark:border-gray-800">
        <span className="text-gray-500 dark:text-gray-400">Error reporting diagnostics monitored by{' '}</span>
        <a
          className="text-blue-700 font-bold hover:underline dark:text-blue-400"
          href="https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo"
        >
          Sentry
        </a>
      </div>

      <a href="https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo" className="block inline-block mx-auto focus:outline-hidden">
        <Image className="mx-auto mt-3" src={sentryLogo} alt="Sentry" width={130} />
      </a>
    </div>
  );
}
