'use client';
import { useMemo } from 'react';
import type { Assignment } from './types';
import { calcStats } from './utils';
export default function Statistics({ items }: { items: Assignment[] }) {
  const stats = useMemo(() => calcStats(items), [items]);
  return <section aria-label="Thống kê"><h2>Thống kê</h2><p>Tổng: {stats.total} · Đã xong: {stats.completed} · Quá hạn: {stats.overdue}</p><ul>{Object.entries(stats.bySubject).map(([subject, count]) => <li key={subject}>{subject}: {count}</li>)}</ul></section>;
}
