'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Icons } from '../ui/Icons';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="flex h-8 w-8 items-center justify-center rounded-full md:h-10 md:w-10"
      >
        <span className="sr-only">Toggle mode</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="group flex h-8 w-8 items-center justify-center rounded-full transition-colors md:h-10 md:w-10"
    >
      <span className="sr-only">Toggle mode</span>
      {resolvedTheme === 'dark' ? (
        <Icons.moon className="h-4 w-4 transition-transform duration-500 group-hover:scale-110 md:h-5 md:w-5" />
      ) : (
        <Icons.sun className="h-4 w-4 transition-transform duration-500 group-hover:scale-110 md:h-5 md:w-5" />
      )}
    </Button>
  );
}
