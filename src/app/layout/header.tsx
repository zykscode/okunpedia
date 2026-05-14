import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/towns", label: "Towns" },
  { href: "/map", label: "Map" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

/**
 * Universal site navigation header container tailored for premium client-side rendering views.
 * @returns {React.ReactNode} Navigation structure supporting fluid navigation layouts.
 */
export function Header() {
  return (
    <>
      {/* Skip-to-content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-700 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header
        className="sticky top-0 z-50 border-b border-gray-200/80 transition-colors duration-300 dark:border-gray-800/80"
        style={{
          background: "var(--color-wiki-card, rgba(255, 255, 255, 0.85))",
          backdropFilter: "saturate(180%) blur(16px)",
          WebkitBackdropFilter: "saturate(180%) blur(16px)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-3 no-underline focus:outline-hidden"
              aria-label="Okunpedia — Home"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-amber-600 text-white shadow-md shadow-emerald-600/20 transition-transform duration-300 group-hover:scale-105 dark:shadow-emerald-950/50">
                <span className="font-serif text-lg font-bold">O</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                  Okunpedia
                </span>
                <span className="hidden text-[10px] font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400 sm:block">
                  The Encyclopedia of Okun Land
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100/60 hover:text-gray-900 focus:outline-hidden dark:text-gray-300 dark:hover:bg-gray-900/60 dark:hover:text-white"
                >
                  {link.label}
                  <span className="absolute right-3 bottom-1 left-3 h-0.5 origin-left scale-x-0 rounded-full bg-emerald-500 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/search"
                className="rounded-xl p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100/60 hover:text-emerald-600 focus:outline-hidden dark:text-gray-400 dark:hover:bg-gray-900/60 dark:hover:text-emerald-400"
                aria-label="Search"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
