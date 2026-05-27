import type { Metadata } from 'next';
import Link from 'next/link';
import { desc } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { adminTodosTable, adminIssuesTable } from '@/models/Schema';
import { TodoPanel } from './TodoPanel';
import { IssuesPanel } from './IssuesPanel';

export const metadata: Metadata = {
  title: 'Tracker — Admin Portal',
  description: 'Private admin todo list and app issue tracker.',
};

export default async function AdminTrackerPage() {
  const [todos, issues] = await Promise.all([
    db.select().from(adminTodosTable).orderBy(desc(adminTodosTable.createdAt)),
    db.select().from(adminIssuesTable).orderBy(desc(adminIssuesTable.createdAt)),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-4 sm:py-8">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-8 text-white shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-bold tracking-wider text-indigo-300 uppercase ring-1 ring-indigo-500/20">
            <span>📋 Admin-only workspace</span>
          </div>
          <nav className="flex items-center gap-1 text-xs font-medium text-gray-400">
            <Link href="/admin" className="transition hover:text-white">Admin</Link>
            <span className="mx-1 opacity-40">/</span>
            <span className="text-white">Tracker</span>
          </nav>
        </div>

        <div className="relative z-10 mt-5">
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Todo &amp; Issues Tracker
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-300">
            Manage your personal task list and log bugs, feature requests, and technical debt items — all in one private workspace.
          </p>
        </div>

        {/* Summary pills */}
        <div className="relative z-10 mt-6 flex flex-wrap gap-3">
          {[
            { label: `${todos.filter((t) => !t.completed).length} open todos`,   color: 'bg-white/5 text-white ring-white/10' },
            { label: `${issues.filter((i) => i.status === 'open').length} open issues`, color: 'bg-red-500/10 text-red-300 ring-red-500/20' },
            { label: `${issues.filter((i) => i.status === 'in_progress').length} in progress`, color: 'bg-amber-500/10 text-amber-300 ring-amber-500/20' },
          ].map((pill) => (
            <span
              key={pill.label}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${pill.color}`}
            >
              {pill.label}
            </span>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Todo panel */}
        <section className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-900/50">
              ✅
            </span>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Todo List</h2>
              <p className="text-xs text-gray-500">
                {todos.filter((t) => !t.completed).length} remaining · {todos.filter((t) => t.completed).length} done
              </p>
            </div>
          </div>
          <TodoPanel todos={todos} />
        </section>

        {/* Issues panel */}
        <section className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-900/50">
              🐛
            </span>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Issues</h2>
              <p className="text-xs text-gray-500">Bugs · Features · Debt</p>
            </div>
          </div>
          <IssuesPanel issues={issues} />
        </section>
      </div>
    </div>
  );
}
