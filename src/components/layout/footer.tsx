import { MapPin, FileText, Users, Mail, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { PageLogo } from '@/components/ui/PageLogo';

const exploreLinks = [
  { href: '/communities', label: 'All Communities' },
  { href: '/map', label: 'Interactive Map' },
  { href: '/blog', label: 'Blog & Articles' },
  { href: '/about', label: 'About Okunpedia' },
  { href: '/search', label: 'Search' },
];

const featuredLinks = [
  { href: '/communities/kabba', label: 'Kabba (Owe)' },
  { href: '/communities/isanlu', label: 'Isanlu' },
  { href: '/communities/mopa', label: 'Mopa' },
  { href: '/communities/egbe', label: 'Egbe' },
  { href: '/communities/iyara', label: 'Iyara' },
  { href: '/communities/ekinrin-adde', label: 'Ekinrin-Adde' },
];

/**
 * Site-wide footer with brand description, navigation links, and legal strip.
 * @returns The footer React element.
 */
export function Footer() {
  return (
    <footer className="mx-auto mt-auto w-full max-w-7xl px-4 pb-28 sm:px-6 md:pb-8 lg:px-8">
      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900/60">
        <div className="pb-8">
          <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-4 md:text-left">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center justify-center gap-2.5 md:justify-start">
                <PageLogo />
                <span className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                  Okunpedia
                </span>
              </div>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-500 md:mx-0 dark:text-gray-400">
                A community-driven digital encyclopedia preserving the rich history, culture, and
                heritage of Okun towns in Kogi State, Nigeria — for future generations.
              </p>
              <p className="mt-4 hidden items-center justify-center gap-1.5 text-sm text-gray-400 md:flex md:justify-start dark:text-gray-500">
                <MapPin className="size-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                Kabba/Bunu · Ijumu · Mopa-Muro · Yagba East · Yagba West, Kogi State
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-gray-900 uppercase md:justify-start dark:text-white">
                <FileText className="size-3.5 text-emerald-500" aria-hidden="true" />
                Explore
              </h3>
              <ul className="space-y-2.5">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 no-underline transition-colors duration-200 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Featured Communities */}
            <div className="hidden md:block">
              <h3 className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-gray-900 uppercase md:justify-start dark:text-white">
                <Users className="size-3.5 text-emerald-500" aria-hidden="true" />
                Communities
              </h3>
              <ul className="space-y-2.5">
                {featuredLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 no-underline transition-colors duration-200 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mb-4 flex flex-col items-center justify-between gap-3 border-t border-gray-200/80 pt-6 sm:flex-row dark:border-gray-800/80">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Okunpedia. Built with ❤️ for Okun land.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/about"
              className="text-xs text-gray-400 no-underline transition-colors hover:text-gray-700 dark:hover:text-gray-200"
            >
              About
            </Link>
            <span className="text-gray-300 dark:text-gray-700" aria-hidden="true">
              ·
            </span>
            <Link
              href="/feedback"
              className="text-xs text-gray-400 no-underline transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              Feedback
            </Link>
            <span className="text-gray-300 dark:text-gray-700" aria-hidden="true">
              ·
            </span>
            <a
              href="mailto:hello@okunpedia.ng"
              className="flex items-center gap-1 text-xs text-gray-400 no-underline transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              <Mail className="size-3" aria-hidden="true" />
              Contact
            </a>
            <span className="text-gray-300 dark:text-gray-700" aria-hidden="true">
              ·
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-xs text-gray-400 no-underline transition-colors hover:text-gray-700 dark:hover:text-gray-200"
            >
              GitHub
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
