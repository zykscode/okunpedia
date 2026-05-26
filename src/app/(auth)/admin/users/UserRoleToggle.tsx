'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserRoleAction } from '@/app/(auth)/admin/actions';

type Props = {
  userId: string;
  currentRole: string;
};

export function UserRoleToggle(props: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isAdmin = props.currentRole === 'ADMIN' || props.currentRole === 'SUPER_ADMIN';
  const newRole = isAdmin ? 'USER' : 'ADMIN';
  const label = isAdmin ? 'Demote to User' : 'Promote to Admin';

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const res = await updateUserRoleAction(props.userId, newRole as 'USER' | 'ADMIN');
      if (!res.success) {
        setError(res.message);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-1">
      <button
        id={`role-toggle-${props.userId}`}
        onClick={handleClick}
        disabled={isPending}
        className={[
          'cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-[0.97] disabled:opacity-50',
          isAdmin
            ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/30'
            : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/30',
        ].join(' ')}
      >
        {isPending ? '...' : label}
      </button>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
