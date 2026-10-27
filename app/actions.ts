'use server';
import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { requirePermission } from '@/lib/access';
import { subjects, mutateDatabase } from '@/lib/deadlines';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
export type FormState = { error?: string; success?: string };
export async function login(_state: FormState, form: FormData): Promise<FormState> {
  const callback = String(form.get('callbackUrl') || '/dashboard');
  const redirectTo = callback.startsWith('/') && !callback.startsWith('//') && !callback.includes('\\') ? callback : '/dashboard';
  try { await signIn('credentials', { email: form.get('email'), password: form.get('password'), redirectTo }); }
  catch (e) { if (e instanceof AuthError) return { error: 'Email hoặc mật khẩu không đúng.' }; throw e; }
  return {};
}
export async function logout() { await signOut({ redirectTo: '/' }); }
const idSchema = z.string().regex(/^[1-9]\d*$/).max(12);
const createSchema = z.object({
  title: z.string().trim().min(5, 'Tiêu đề cần ít nhất 5 ký tự.').max(160),
  description: z.string().trim().min(10, 'Mô tả cần ít nhất 10 ký tự.').max(3000),
  subjectSlug: z.string().refine(s => subjects.some(subject => subject.slug === s), 'Môn học không hợp lệ.'),
  dueDate: z.string().datetime({ offset: true }), priority: z.enum(['high', 'medium', 'low']),
});
function invalidate(id: string) {
  revalidatePath(`/deadlines/${id}`);
  revalidatePath(`/deadlines/${id}/share`);
  revalidatePath('/deadlines'); revalidatePath('/sitemap.xml');
  revalidatePath('/admin'); revalidatePath('/dashboard');
}
export async function createDeadline(_state: FormState, form: FormData): Promise<FormState> {
  await requirePermission('deadline:create', '/admin');
  const parsed = createSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const id = await mutateDatabase(db => { const id = String(db.nextId++); db.deadlines.push({ ...parsed.data, id }); return id; });
  invalidate(id); return { success: 'Đã thêm deadline.' };
}
export async function deleteDeadline(form: FormData) {
  await requirePermission('deadline:delete', '/admin');
  const id = idSchema.parse(form.get('id'));
  await mutateDatabase(db => {
    if (!db.deadlines.some(d => d.id === id)) throw new Error('Deadline không tồn tại.');
    db.deadlines = db.deadlines.filter(d => d.id !== id);
    for (const userId of Object.keys(db.completions)) db.completions[userId] = db.completions[userId].filter(value => value !== id);
  }); invalidate(id);
}
export async function toggleComplete(form: FormData) {
  const user = await requirePermission('deadline:complete', '/dashboard');
  const id = idSchema.parse(form.get('id'));
  await mutateDatabase(db => {
    if (!db.deadlines.some(d => d.id === id)) throw new Error('Deadline không tồn tại.');
    const completed = db.completions[user.id] ?? [];
    db.completions[user.id] = completed.includes(id) ? completed.filter(value => value !== id) : [...completed, id];
  }); revalidatePath('/dashboard');
}
