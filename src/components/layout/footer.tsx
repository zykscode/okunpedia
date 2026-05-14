import Link from "next/link";
import { BookOpen, MapPin, FileText, Users, Mail } from "lucide-react";

const exploreLinks = [
  { href: "/towns", label: "All Towns" },
  { href: "/map", label: "Interactive Map" },
  { href: "/blog", label: "Blog & Articles" },
  { href: "/about", label: "About Okunpedia" },
  { href: "/search", label: "Search" },
];

const resourceLinks = [
  { href: "/towns/kabba", label: "Kabba" },
  { href: "/towns/isanlu", label: "Isanlu" },
  { href: "/towns/mopa", label: "Mopa" },
  { href: "/towns/egbe", label: "Egbe" },
];

export function Footer() {
  return (
    <footer
      className="border-t border-wiki-border theme-transition mt-auto"
      style={{
        background: "var(--color-wiki-card)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-forest-600/10 text-forest-600 dark:bg-forest-500/20 dark:text-forest-400">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="text-lg font-display font-bold text-wiki-text">Okunpedia</span>
            </div>
            <p className="text-sm text-wiki-muted leading-relaxed max-w-sm">
              A community-driven encyclopedia documenting the rich history, culture, and heritage of
              Okun towns in Kogi State, Nigeria.
            </p>
            <p className="text-xs text-wiki-muted mt-4 flex items-center gap-2">
              <MapPin className="h-3 w-3 text-forest-500 flex-shrink-0" aria-hidden="true" />
              Kabba/Bunu, Ijumu, Mopa-Muro, Yagba East, Yagba West — Kogi State, NG
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-sm text-wiki-text mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-forest-500" aria-hidden="true" />
              Explore
            </h3>
            <ul className="space-y-2.5" role="list">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-wiki-muted hover:text-forest-600 dark:hover:text-forest-400 no-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Towns */}
          <div>
            <h3 className="font-semibold text-sm text-wiki-text mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-forest-500" aria-hidden="true" />
              Featured Towns
            </h3>
            <ul className="space-y-2.5" role="list">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-wiki-muted hover:text-forest-600 dark:hover:text-forest-400 no-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-wiki-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-wiki-muted">
            © {new Date().getFullYear()} Okunpedia. Built with ❤️ for Okun land.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="text-xs text-wiki-muted hover:text-wiki-text no-underline transition-colors"
            >
              About
            </Link>
            <span className="text-wiki-border" aria-hidden="true">
              ·
            </span>
            <a
              href="mailto:hello@okunpedia.ng"
              className="text-xs text-wiki-muted hover:text-forest-600 dark:hover:text-forest-400 no-underline transition-colors flex items-center gap-1"
            >
              <Mail className="h-3 w-3" aria-hidden="true" />
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
