'use client';

import { useActionState, useState, useTransition } from 'react';
import {
  AlertCircle, Sparkles, Wrench, TrendingUp,
  Trash2, Pencil, X, Save, Plus, ChevronDown, Loader2,
} from 'lucide-react';
import {
  createIssueAction,
  updateIssueAction,
  updateIssueStatusAction,
  deleteIssueAction,
} from './actions';
import type { ActionState } from './actions';

type IssueType = 'bug' | 'feature' | 'debt' | 'improvement';
type Priority  = 'low' | 'medium' | 'high' | 'critical';
type Status    = 'open' | 'in_progress' | 'resolved' | 'closed';

type Issue = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  priority: string;
  status: string;
  createdAt: Date;
};

const initialState: ActionState = { success: false, message: '' };

// ── Helpers ─────────────────────────────────────────────────────────────────

const TYPE_META: Record<IssueType, { label: string; icon: React.ReactNode; color: string }> = {
  bug:         { label: 'Bug',         icon: <AlertCircle className="size-3.5" />, color: 'text-red-600 bg-red-50 ring-red-200 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-800/60' },
  feature:     { label: 'Feature',     icon: <Sparkles className="size-3.5" />,    color: 'text-indigo-600 bg-indigo-50 ring-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-800/60' },
  debt:        { label: 'Tech Debt',   icon: <Wrench className="size-3.5" />,      color: 'text-amber-700 bg-amber-50 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-800/60' },
  improvement: { label: 'Improvement', icon: <TrendingUp className="size-3.5" />,  color: 'text-emerald-700 bg-emerald-50 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/60' },
};

const PRIORITY_COLOR: Record<Priority, string> = {
  low:      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  medium:   'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  high:     'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  critical: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
};

const STATUS_COLOR: Record<Status, string> = {
  open:        'bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  resolved:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  closed:      'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
};

function TypeBadge(props: { type: string }) {
  const meta = TYPE_META[props.type as IssueType] ?? TYPE_META.bug;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${meta.color}`}>
      {meta.icon}
      {meta.label}
    </span>
  );
}

function PriorityBadge(props: { priority: string }) {
  const cls = PRIORITY_COLOR[props.priority as Priority] ?? PRIORITY_COLOR.medium;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {props.priority}
    </span>
  );
}

function StatusSelect(props: { issueId: number; current: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative inline-flex items-center">
      <select
        disabled={isPending}
        defaultValue={props.current}
        onChange={(e) => {
          const val = e.target.value as Status;
          startTransition(async () => {
            await updateIssueStatusAction(props.issueId, val);
          });
        }}
        className={`appearance-none rounded-full pl-2.5 pr-6 py-0.5 text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer border-0 ${STATUS_COLOR[props.current as Status] ?? STATUS_COLOR.open} disabled:opacity-60`}
      >
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-1.5 size-2.5 opacity-60" />
      {isPending && <Loader2 className="absolute right-1 size-3 animate-spin" />}
    </div>
  );
}

// ── Issue form (shared for add + edit) ──────────────────────────────────────

function IssueForm(props: {
  defaultValues?: Partial<Issue>;
  formAction: (fd: FormData) => Promise<void>;
  pending: boolean;
  state: ActionState;
  onCancel: () => void;
}) {
  const dv = props.defaultValues ?? {};
  return (
    <form
      action={props.formAction}
      className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/10"
    >
      <input
        name="title"
        placeholder="Issue title…"
        defaultValue={dv.title ?? ''}
        required
        maxLength={300}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
      />
      <textarea
        name="description"
        placeholder="Description (optional)…"
        defaultValue={dv.description ?? ''}
        rows={3}
        maxLength={5000}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      />
      <div className="grid grid-cols-3 gap-2">
        {(
          [
            { name: 'type',     label: 'Type',     options: [['bug','Bug'],['feature','Feature'],['debt','Tech Debt'],['improvement','Improvement']] },
            { name: 'priority', label: 'Priority', options: [['low','Low'],['medium','Medium'],['high','High'],['critical','Critical']] },
            { name: 'status',   label: 'Status',   options: [['open','Open'],['in_progress','In Progress'],['resolved','Resolved'],['closed','Closed']] },
          ] as const
        ).map((field) => (
          <div key={field.name}>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              {field.label}
            </label>
            <select
              name={field.name}
              defaultValue={(dv as Record<string, string>)[field.name] ?? field.options[0][0]}
              className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {field.options.map(([val, lbl]) => (
                <option key={val} value={val}>{lbl}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {props.state.message && !props.state.success && (
        <p className="text-xs text-red-500">{props.state.message}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={props.pending}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {props.pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save
        </button>
        <button
          type="button"
          onClick={props.onCancel}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <X className="size-4" /> Cancel
        </button>
      </div>
    </form>
  );
}

// ── Single issue card ────────────────────────────────────────────────────────

function IssueCard(props: { issue: Issue }) {
  const { issue } = props;
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const boundUpdate = updateIssueAction.bind(null, issue.id);
  const [updateState, updateFormAction, updatePending] = useActionState(boundUpdate, initialState);

  function handleDelete() {
    startTransition(async () => {
      await deleteIssueAction(issue.id);
    });
  }

  if (editing) {
    return (
      <IssueForm
        defaultValues={issue}
        formAction={async (fd) => {
          await updateFormAction(fd);
          setEditing(false);
        }}
        pending={updatePending}
        state={updateState}
        onCancel={() => setEditing(false)}
      />
    );
  }

  const isResolved = issue.status === 'resolved' || issue.status === 'closed';

  return (
    <div
      className={`group relative rounded-2xl border bg-white p-4 shadow-xs transition dark:bg-gray-900/60 ${
        isResolved
          ? 'border-gray-100 opacity-60 dark:border-gray-800/50'
          : 'border-gray-200/80 hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:hover:border-indigo-800'
      } ${isPending ? 'opacity-40' : ''}`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <TypeBadge type={issue.type} />
        <PriorityBadge priority={issue.priority} />
        <StatusSelect issueId={issue.id} current={issue.status} />
      </div>

      <p className={`text-sm font-semibold leading-snug text-gray-900 dark:text-white ${isResolved ? 'line-through' : ''}`}>
        {issue.title}
      </p>

      {issue.description && (
        <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          {issue.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">
          {new Date(issue.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Edit issue"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            aria-label="Delete issue"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main panel ───────────────────────────────────────────────────────────────

export function IssuesPanel(props: { issues: Issue[] }) {
  const { issues } = props;
  const [adding, setAdding] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType]     = useState<string>('all');

  const [createState, createFormAction, createPending] = useActionState(createIssueAction, initialState);

  const filtered = issues.filter((i) => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    if (filterType   !== 'all' && i.type   !== filterType)   return false;
    return true;
  });

  const openCount     = issues.filter((i) => i.status === 'open').length;
  const progressCount = issues.filter((i) => i.status === 'in_progress').length;

  return (
    <div className="flex flex-col gap-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Total',       value: issues.length,  cls: 'text-gray-900 dark:text-white' },
          { label: 'Open',        value: openCount,      cls: 'text-sky-600 dark:text-sky-400' },
          { label: 'In Progress', value: progressCount,  cls: 'text-amber-600 dark:text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-2.5 dark:border-gray-800 dark:bg-gray-900/60">
            <div className={`text-xl font-extrabold ${s.cls}`}>{s.value}</div>
            <div className="text-[10px] text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters + add button */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="all">All status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="all">All types</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="debt">Tech Debt</option>
          <option value="improvement">Improvement</option>
        </select>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          {adding ? <X className="size-4" /> : <Plus className="size-4" />}
          {adding ? 'Cancel' : 'New Issue'}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <IssueForm
          formAction={async (fd) => {
            await createFormAction(fd);
            setAdding(false);
          }}
          pending={createPending}
          state={createState}
          onCancel={() => setAdding(false)}
        />
      )}

      {/* Issue cards */}
      {filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">
          {issues.length === 0 ? 'No issues logged yet.' : 'No issues match the current filters.'}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
