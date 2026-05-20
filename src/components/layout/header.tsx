'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { KBarButton } from 'pliny/search/KBarButton';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { PageLogo } from '@/components/ui/PageLogo';
import { AppConfig } from '@/utils/AppConfig';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/communities', label: 'Communities' },
  { href: '/map', label: 'Map' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

/**
 * Primary site header with glassmorphic background, desktop navigation, and mobile nav toggle.
 */
export function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b border-gray-200/80 dark:border-gray-800/80"
      style={{
        background: 'var(--color-wiki-card)',
        backdropFilter: 'saturate(180%) blur(16px)',
        WebkitBackdropFilter: 'saturate(180%) blur(16px)',
      }}
    >
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 no-underline focus:outline-hidden"
            aria-label="Okunpedia — Home"
          >
            <div className="transition-transform duration-300 group-hover:scale-105">
              <PageLogo />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-base font-bold tracking-tight text-gray-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400 sm:text-lg">
                Okunpedia
              </span>
              <span className="hidden text-[10px] font-medium tracking-widest text-gray-500 uppercase dark:text-gray-400 sm:block">
                Encyclopedia of Okun Land
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'group relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-200 focus:outline-hidden',
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'text-gray-600 hover:bg-gray-100/60 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white',
                  ].join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute right-3 bottom-0.5 left-3 h-0.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {AppConfig.search && AppConfig.search.provider === 'kbar' ? (
              <KBarButton
                aria-label="Search"
                className="rounded-xl p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100/60 hover:text-emerald-700 focus:outline-hidden dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-emerald-400"
              >
                <Search className="size-4" aria-hidden="true" />
              </KBarButton>
            ) : null}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
