'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/libs/DB';
import { requireRole } from '@/libs/auth/guards';
import { adminTodosTable, adminIssuesTable } from '@/models/Schema';

export type ActionState = { success: boolean; message: string };

// ---------------------------------------------------------------
// SCHEMAS
// ---------------------------------------------------------------

const TodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  notes: z.string().max(2000).optional(),
});

const IssueSchema = z.object({
  title:       z.string().min(1, 'Title is required').max(300),
  description: z.string().max(5000).optional(),
  type:        z.enum(['bug', 'feature', 'debt', 'improvement']).default('bug'),
  priority:    z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  status:      z.enum(['open', 'in_progress', 'resolved', 'closed']).default('open'),
});

const revalidate = () => revalidatePath('/admin/tracker');

// ---------------------------------------------------------------
// TODO ACTIONS
// ---------------------------------------------------------------

export async function createTodoAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole('ADMIN');

  const parsed = TodoSchema.safeParse({
    title: formData.get('title'),
    notes: formData.get('notes') ?? undefined,
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Validation failed.' };
  }

  await db.insert(adminTodosTable).values({
    title: parsed.data.title,
    notes: parsed.data.notes ?? null,
    completed: false,
  });

  revalidate();
  return { success: true, message: 'Todo added.' };
}

export async function updateTodoAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole('ADMIN');

  const parsed = TodoSchema.safeParse({
    title: formData.get('title'),
    notes: formData.get('notes') ?? undefined,
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Validation failed.' };
  }

  await db
    .update(adminTodosTable)
    .set({ title: parsed.data.title, notes: parsed.data.notes ?? null })
    .where(eq(adminTodosTable.id, id));

  revalidate();
  return { success: true, message: 'Todo updated.' };
}

export async function toggleTodoAction(id: number, completed: boolean): Promise<ActionState> {
  await requireRole('ADMIN');
  await db.update(adminTodosTable).set({ completed }).where(eq(adminTodosTable.id, id));
  revalidate();
  return { success: true, message: completed ? 'Marked complete.' : 'Marked incomplete.' };
}

export async function deleteTodoAction(id: number): Promise<ActionState> {
  await requireRole('ADMIN');
  await db.delete(adminTodosTable).where(eq(adminTodosTable.id, id));
  revalidate();
  return { success: true, message: 'Todo deleted.' };
}

// ---------------------------------------------------------------
// ISSUE ACTIONS
// ---------------------------------------------------------------

export async function createIssueAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole('ADMIN');

  const parsed = IssueSchema.safeParse({
    title:       formData.get('title'),
    description: formData.get('description') ?? undefined,
    type:        formData.get('type') ?? 'bug',
    priority:    formData.get('priority') ?? 'medium',
    status:      formData.get('status') ?? 'open',
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Validation failed.' };
  }

  await db.insert(adminIssuesTable).values(parsed.data);
  revalidate();
  return { success: true, message: 'Issue created.' };
}

export async function updateIssueAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole('ADMIN');

  const parsed = IssueSchema.safeParse({
    title:       formData.get('title'),
    description: formData.get('description') ?? undefined,
    type:        formData.get('type') ?? 'bug',
    priority:    formData.get('priority') ?? 'medium',
    status:      formData.get('status') ?? 'open',
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Validation failed.' };
  }

  await db.update(adminIssuesTable).set(parsed.data).where(eq(adminIssuesTable.id, id));
  revalidate();
  return { success: true, message: 'Issue updated.' };
}

export async function updateIssueStatusAction(
  id: number,
  status: 'open' | 'in_progress' | 'resolved' | 'closed',
): Promise<ActionState> {
  await requireRole('ADMIN');
  await db.update(adminIssuesTable).set({ status }).where(eq(adminIssuesTable.id, id));
  revalidate();
  return { success: true, message: 'Status updated.' };
}

export async function deleteIssueAction(id: number): Promise<ActionState> {
  await requireRole('ADMIN');
  await db.delete(adminIssuesTable).where(eq(adminIssuesTable.id, id));
  revalidate();
  return { success: true, message: 'Issue deleted.' };
}
