import 'server-only';
import { readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import subjectsData from '@/data/subjects.json';
export const subjects = subjectsData;
export type Deadline = { id: string; title: string; subjectSlug: string; description: string; dueDate: string; priority: 'low' | 'medium' | 'high' };
export type Database = { nextId: number; deadlines: Deadline[]; completions: Record<string, string[]> };
const file = path.join(process.cwd(), 'data/deadlines.json');
export async function readDatabase(): Promise<Database> { return JSON.parse(await readFile(file, 'utf8')); }
export async function getDeadlines() { return (await readDatabase()).deadlines; }
export async function getDeadline(id: string) { return (await getDeadlines()).find(d => d.id === id); }
export function subjectName(slug: string) { return subjects.find(s => s.slug === slug)?.name ?? slug; }
// Serialize mutations and atomically replace JSON: readers never see a partially written file.
let queue: Promise<void> = Promise.resolve();
export function mutateDatabase<T>(change: (db: Database) => T): Promise<T> {
  const operation = queue.then(async () => {
    const db = await readDatabase(); const result = change(db);
    const temp = `${file}.${randomUUID()}.tmp`;
    await writeFile(temp, JSON.stringify(db, null, 2) + '\n', { mode: 0o600 });
    await rename(temp, file); return result;
  });
  queue = operation.then(() => undefined, () => undefined); return operation;
}
