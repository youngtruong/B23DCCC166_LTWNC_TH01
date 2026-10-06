import type { Assignment } from './types';
export function calcDaysLeft(dueDate: string, now = new Date()) {
  const due = new Date(`${dueDate}T00:00:00`);
  return Math.round((Date.UTC(due.getFullYear(), due.getMonth(), due.getDate()) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
}
export function isOverdue(item: Assignment, now = new Date()) { return !item.completed && calcDaysLeft(item.dueDate, now) < 0; }
export function calcStats(items: readonly Assignment[], now = new Date()) {
  const stats = { total: items.length, completed: 0, overdue: 0, bySubject: {} as Record<string, number> };
  for (const item of items) { if (item.completed) stats.completed++; if (isOverdue(item, now)) stats.overdue++; stats.bySubject[item.subject] = (stats.bySubject[item.subject] ?? 0) + 1; }
  return stats;
}
export function generateAssignments(count = 10000): Assignment[] {
  const subjects = ['Lập trình Web', 'Cơ sở dữ liệu', 'Toán', 'Tiếng Anh'];
  return Array.from({ length: count }, (_, index) => { const date = new Date(); date.setDate(date.getDate() + index % 31 - 15); return { id: `sample-${index}`, subject: subjects[index % 4], title: `Bài tập mẫu ${index + 1}`, dueDate: `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`, completed: index % 5 === 0, priority: index % 3 === 0 ? 'high' : 'medium' }; });
}
