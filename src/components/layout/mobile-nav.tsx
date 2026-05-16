'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/communities', label: 'Communities' },
  { href: '/map', label: 'Map' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/search', label: 'Search' },
];

/**
 * Full-screen slide-in mobile navigation drawer with spring animation.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center rounded-xl p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100/60 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white"
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              style={{ backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              className="fixed inset-y-0 right-0 z-50 w-72 border-l border-gray-200/80 dark:border-gray-800"
              style={{ background: 'var(--color-wiki-card-strong)', backdropFilter: 'blur(16px)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              role="dialog"
              aria-label="Navigation menu"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-gray-200/80 px-5 py-4 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                    <BookOpen className="size-4" aria-hidden="true" />
                  </div>
                  <span className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                    Okunpedia
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl p-2 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                  aria-label="Close navigation menu"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="p-4" aria-label="Mobile navigation">
                <ul className="space-y-0.5">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={[
                            'block rounded-xl px-4 py-3 text-[15px] font-medium no-underline transition-all duration-200',
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/60 dark:hover:text-white',
                          ].join(' ')}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Drawer footer */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200/80 px-5 py-4 dark:border-gray-800">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Preserving Okun heritage since 2024
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
