// oxlint-disable jsdoc/require-returns
'use client';

import { motion } from 'framer-motion';
import { Home, Map, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/communities', label: 'Communities', icon: BookOpen },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/blog', label: 'Blog', icon: Users },
];

/**
 * Fixed bottom navigation bar for mobile viewports with animated active indicator.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 overflow-hidden border-t border-gray-200/80 shadow-lg shadow-black/10 saturate-150 backdrop-blur-xl md:hidden dark:border-gray-800/80 dark:bg-gray-950/90">
      <div
        className="flex items-center justify-between px-2"
        style={{
          height: '60px',
          backdropFilter: 'saturate(180%) blur(16px)',
          WebkitBackdropFilter: 'saturate(180%) blur(16px)',
        }}
      >
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 no-underline"
            >
              {/* Active pill background */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-pill"
                  className="absolute inset-x-1 inset-y-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}

              <div
                className={cn(
                  'relative z-10 flex items-center justify-center transition-colors duration-200',
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-gray-400 dark:text-gray-500',
                )}
              >
                <item.icon className="size-5" strokeWidth={isActive ? 2.5 : 1.75} />
              </div>
              <span
                className={cn(
                  'relative z-10 text-[10px] font-semibold tracking-wide transition-colors duration-200',
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-gray-400 dark:text-gray-500',
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
