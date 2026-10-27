'use client';
import { useEffect, useState } from 'react';
export function Countdown({ dueDate }: { dueDate: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { const update = () => setNow(Date.now()); update(); const timer = setInterval(update, 60000); return () => clearInterval(timer); }, []);
  if (now === null) return <span className="countdown">Đang tính thời gian…</span>;
  const diff = new Date(dueDate).getTime() - now;
  const days = Math.ceil(Math.abs(diff) / 86400000);
  return <span className={diff < 0 ? 'countdown overdue' : 'countdown'}>{diff < 0 ? `Quá hạn ${days} ngày` : `Còn ${days} ngày`}</span>;
}
