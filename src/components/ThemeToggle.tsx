'use client';

import { useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

export const ThemeToggle = () => {
  const [mode, setMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const saved = localStorage.getItem('okunpedia_theme') as ThemeMode | null;
    if (saved) {
      setMode(saved);
    }
  }, []);

  const applyTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('okunpedia_theme', newMode);
      const root = document.documentElement;
      
      if (newMode === 'dark') {
        root.classList.add('dark');
      } else if (newMode === 'light') {
        root.classList.remove('dark');
      } else {
        // System preference evaluation
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    }
  };

  return (
    <div className="flex items-center rounded-xl bg-gray-100/80 p-0.5 ring-1 ring-gray-200/60 dark:bg-gray-900/80 dark:ring-gray-800">
      {/* Light Button */}
      <button
        type="button"
        onClick={() => applyTheme('light')}
        title="Light Mode"
        className={`flex size-7 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer ${
          mode === 'light'
            ? 'bg-white text-amber-600 shadow-xs dark:bg-gray-800 dark:text-amber-400'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
      >
        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </button>

      {/* System Button */}
      <button
        type="button"
        onClick={() => applyTheme('system')}
        title="System Auto"
        className={`flex size-7 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer ${
          mode === 'system'
            ? 'bg-white text-emerald-600 shadow-xs dark:bg-gray-800 dark:text-emerald-400'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
      >
        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </button>

      {/* Dark Button */}
      <button
        type="button"
        onClick={() => applyTheme('dark')}
        title="Dark Mode"
        className={`flex size-7 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer ${
          mode === 'dark'
            ? 'bg-white text-indigo-600 shadow-xs dark:bg-gray-800 dark:text-indigo-400'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
      >
        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>
    </div>
  );
};
