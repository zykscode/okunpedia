'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Users, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div className="fixed right-4 bottom-4 left-4 z-50 overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 shadow-lg shadow-black/10 backdrop-blur-xl saturate-150 md:hidden dark:border-gray-800/80 dark:bg-gray-950/90">
      <div className="flex items-center justify-around px-2" style={{ height: '60px' }}>
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
