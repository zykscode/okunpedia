'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors duration-150 cursor-pointer border-none bg-transparent p-0"
    >
      Sign Out
    </button>
  );
}
