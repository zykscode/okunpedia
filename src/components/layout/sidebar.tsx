import Link from "next/link";
import { cn } from "@/lib/utils";
import { FileText, Landmark, Globe, Coins, BookOpen } from "lucide-react";

interface SidebarProps {
  townSlug: string;
  currentPage?: string;
  pages: { slug: string; title: string; type: string }[];
}

const iconMap: Record<string, React.ReactNode> = {
  HISTORY: <Landmark className="h-4 w-4" />,
  CULTURE: <BookOpen className="h-4 w-4" />,
  GEOGRAPHY: <Globe className="h-4 w-4" />,
  ECONOMY: <Coins className="h-4 w-4" />,
  CUSTOM: <FileText className="h-4 w-4" />,
};

export function Sidebar({ townSlug, currentPage, pages }: SidebarProps) {
  return (
    <nav className="w-full lg:w-64 shrink-0">
      <div
        className="sticky top-20 rounded-2xl border border-wiki-border overflow-hidden theme-transition"
        style={{ background: "var(--color-wiki-card)", backdropFilter: "blur(12px)" }}
      >
        <div className="px-4 py-3 bg-forest-600/10 dark:bg-forest-500/20">
          <h3 className="text-white font-semibold text-sm">Contents</h3>
        </div>
        <div className="p-2">
          <Link
            href={`/towns/${townSlug}`}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl text-sm no-underline transition-all duration-200",
              !currentPage
                ? "bg-forest-600/10 text-forest-600 dark:bg-forest-500/20 dark:text-forest-400 font-medium"
                : "text-wiki-muted hover:bg-wiki-hover hover:text-wiki-text",
            )}
          >
            <BookOpen className="h-4 w-4" />
            Overview
          </Link>
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={`/towns/${townSlug}/${page.slug}`}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm no-underline transition-all duration-200",
                currentPage === page.slug
                  ? "bg-forest-600/10 text-forest-600 dark:bg-forest-500/20 dark:text-forest-400 font-medium"
                  : "text-wiki-muted hover:bg-wiki-hover hover:text-wiki-text",
              )}
            >
              {iconMap[page.type] || <FileText className="h-4 w-4" />}
              {page.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
