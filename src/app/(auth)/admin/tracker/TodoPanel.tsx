'use client';

import { useActionState, useState, useTransition } from 'react';
import { CheckCircle2, Circle, Pencil, Trash2, Plus, X, Save, Loader2 } from 'lucide-react';
import {
  createTodoAction,
  updateTodoAction,
  toggleTodoAction,
  deleteTodoAction,
} from './actions';
import type { ActionState } from './actions';

type Todo = {
  id: number;
  title: string;
  notes: string | null;
  completed: boolean;
  createdAt: Date;
};

const initialState: ActionState = { success: false, message: '' };

function AddTodoForm() {
  const [state, formAction, pending] = useActionState(createTodoAction, initialState);
  const [expanded, setExpanded] = useState(false);

  return (
    <form action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <input
          id="todo-title"
          name="title"
          type="text"
          placeholder="Add a new todo…"
          required
          maxLength={300}
          onFocus={() => setExpanded(true)}
          className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-xs outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white dark:placeholder-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add
        </button>
      </div>

      {expanded && (
        <textarea
          name="notes"
          placeholder="Optional notes…"
          rows={2}
          maxLength={2000}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:placeholder-gray-500"
        />
      )}

      {state.message && (
        <p className={`text-xs ${state.success ? 'text-emerald-600' : 'text-red-500'}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}

function TodoItem(props: { todo: Todo }) {
  const { todo } = props;
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const boundUpdate = updateTodoAction.bind(null, todo.id);
  const [updateState, updateFormAction, updatePending] = useActionState(boundUpdate, initialState);

  function handleToggle() {
    startTransition(async () => {
      await toggleTodoAction(todo.id, !todo.completed);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteTodoAction(todo.id);
    });
  }

  if (editing) {
    return (
      <form
        action={async (fd) => {
          await updateFormAction(fd);
          setEditing(false);
        }}
        className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-3 dark:border-indigo-800/50 dark:bg-indigo-950/20"
      >
        <input
          name="title"
          defaultValue={todo.title}
          required
          maxLength={300}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <textarea
          name="notes"
          defaultValue={todo.notes ?? ''}
          rows={2}
          maxLength={2000}
          placeholder="Notes…"
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        />
        {updateState.message && !updateState.success && (
          <p className="mt-1 text-xs text-red-500">{updateState.message}</p>
        )}
        <div className="mt-2 flex gap-2">
          <button
            type="submit"
            disabled={updatePending}
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {updatePending ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <X className="size-3" /> Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      className={`group flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-gray-50 dark:hover:bg-gray-800/40 ${isPending ? 'opacity-50' : ''}`}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        className="mt-0.5 shrink-0 text-gray-400 transition hover:text-indigo-600"
      >
        {todo.completed
          ? <CheckCircle2 className="size-5 text-indigo-500" />
          : <Circle className="size-5" />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium leading-snug ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {todo.title}
        </p>
        {todo.notes && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{todo.notes}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="Edit todo"
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          aria-label="Delete todo"
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function TodoPanel(props: { todos: Todo[] }) {
  const { todos } = props;
  const open = todos.filter((t) => !t.completed);
  const done = todos.filter((t) => t.completed);

  return (
    <div className="flex flex-col gap-4">
      <AddTodoForm />

      {todos.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">No todos yet. Add one above.</p>
      ) : (
        <div className="space-y-1">
          {open.map((t) => <TodoItem key={t.id} todo={t} />)}

          {done.length > 0 && (
            <>
              <p className="px-3 pt-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Completed ({done.length})
              </p>
              {done.map((t) => <TodoItem key={t.id} todo={t} />)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
