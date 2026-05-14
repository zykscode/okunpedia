"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-wiki-muted hover:text-wiki-text cursor-pointer"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-50"
              style={{ backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-72 border-l border-wiki-border z-50"
              style={{ background: "var(--color-wiki-card-strong)", backdropFilter: "blur(16px)" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-wiki-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-forest-600/10 text-forest-600 dark:bg-forest-500/20 dark:text-forest-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="text-xl font-display font-medium text-wiki-text tracking-tight">
                    Okunpedia
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 cursor-pointer text-wiki-muted hover:text-wiki-text rounded-xl hover:bg-forest-50 dark:hover:bg-forest-900/20 transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {[
                  { href: "/", label: "Home" },
                  { href: "/towns", label: "Towns" },
                  { href: "/map", label: "Map" },
                  { href: "/blog", label: "Blog" },
                  { href: "/about", label: "About" },
                  { href: "/search", label: "Search" },
                  { href: "/auth/login", label: "Sign in" },
                  { href: "/auth/register", label: "Create account" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-wiki-muted hover:bg-forest-50 dark:hover:bg-forest-900/20 hover:text-forest-600 dark:hover:text-forest-400 no-underline transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
