"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/towns", label: "Towns", icon: BookOpen },
    { href: "/map", label: "Map", icon: Map },
    { href: "/blog", label: "Blog", icon: Users },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 bg-wiki-card/80 backdrop-blur-xl saturate-150 border border-wiki-border shadow-lg rounded-3xl pb-safe-offset overflow-hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          // Precise matching for root, startsWith for others
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full no-underline"
            >
              <div
                className={cn(
                  "flex items-center justify-center p-1.5 rounded-full transition-colors",
                  isActive ? "text-forest-600 dark:text-forest-400" : "text-wiki-muted",
                )}
              >
                <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium mt-0.5 transition-colors",
                  isActive ? "text-forest-600 dark:text-forest-400" : "text-wiki-muted",
                )}
              >
                {item.label}
              </span>

              {/* Active Indicator Dot */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute top-1 right-1/4 w-1.5 h-1.5 bg-forest-500 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
