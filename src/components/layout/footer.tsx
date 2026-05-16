import Link from 'next/link';
import { BookOpen, MapPin, FileText, Users, Mail, ArrowUpRight } from 'lucide-react';

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
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200/80 bg-white dark:border-gray-800/80 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <BookOpen className="size-4" aria-hidden="true" />
                </div>
                <span className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                  Okunpedia
                </span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                A community-driven digital encyclopedia preserving the rich history, culture, and
                heritage of Okun towns in Kogi State, Nigeria — for future generations.
              </p>
              <p className="mt-4 flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
                <MapPin className="size-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                Kabba/Bunu · Ijumu · Mopa-Muro · Yagba East · Yagba West, Kogi State
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-widest text-gray-900 uppercase dark:text-white">
                <FileText className="size-3.5 text-emerald-500" aria-hidden="true" />
                Explore
              </h3>
              <ul className="space-y-2.5" role="list">
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
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-widest text-gray-900 uppercase dark:text-white">
                <Users className="size-3.5 text-emerald-500" aria-hidden="true" />
                Communities
              </h3>
              <ul className="space-y-2.5" role="list">
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
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200/80 py-6 sm:flex-row dark:border-gray-800/80">
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
            <span className="text-gray-300 dark:text-gray-700" aria-hidden="true">·</span>
            <a
              href="mailto:hello@okunpedia.ng"
              className="flex items-center gap-1 text-xs text-gray-400 no-underline transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              <Mail className="size-3" aria-hidden="true" />
              Contact
            </a>
            <span className="text-gray-300 dark:text-gray-700" aria-hidden="true">·</span>
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
