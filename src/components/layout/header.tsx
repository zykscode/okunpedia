import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import PageLogo from "../ui/PageLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/towns", label: "Towns" },
  { href: "/map", label: "Map" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
 
      <header
        className="sticky h-24 top-0 z-50 border-b border-wiki-border theme-transition"
        style={{
          background: "var(--color-wiki-card)",
          backdropFilter: "saturate(180%) blur(16px)",
          WebkitBackdropFilter: "saturate(180%) blur(16px)",
        }}
      >
        <div className="max-w-7xl bg-green-400 mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 no-underline group flex-shrink-0"
              aria-label="Okunpedia — Home"
            >
              <div className="p-2 rounded-xl bg-forest-600/10 text-forest-600 dark:bg-forest-500/20 dark:text-forest-400 group-hover:bg-forest-600 group-hover:text-white dark:group-hover:bg-forest-500 transition-all duration-300">
                <PageLogo />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-display font-bold text-wiki-text tracking-tight transition-colors group-hover:text-forest-600 dark:group-hover:text-forest-400">
                  Okunpedia
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-wider text-wiki-muted font-medium">
                  The Encyclopedia of Okun Land
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-wiki-muted hover:text-wiki-text transition-colors duration-200 rounded-xl hover:bg-wiki-hover group"
                >
                  {link.label}
                  <span className="absolute left-3 right-3 bottom-1 h-0.5 bg-forest-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full origin-left" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/search"
                className="p-2 text-wiki-muted hover:text-forest-600 dark:hover:text-forest-400 rounded-xl hover:bg-wiki-hover transition-all duration-200"
                aria-label="Search"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
    
  );
}
