import { requirePermission } from '@/lib/access';
import { readDatabase } from '@/lib/deadlines';
import { DeadlineCard } from '@/components/hub/DeadlineCard';
import { MutationForm } from '@/components/hub/MutationForm';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Deadline của tôi', robots: { index: false, follow: false } };
export default async function Dashboard() {
  const user = await requirePermission('deadline:complete', '/dashboard');
  const db = await readDatabase(); const completed = db.completions[user.id] || [];
  const percent = db.deadlines.length ? Math.round(completed.length / db.deadlines.length * 100) : 0;
  return <><div className="page-heading"><p className="eyebrow">TIẾN ĐỘ HỌC TẬP</p><h1>Xin chào, {user.name}</h1><p>Đã hoàn thành {completed.length}/{db.deadlines.length} deadline.</p></div><section className="progress-panel" aria-label="Tiến độ hoàn thành"><div className="progress-text"><strong>Mỗi deadline xong, một bước tiến</strong><span>{completed.length} đã hoàn thành · {db.deadlines.length - completed.length} bài cần thực hiện</span><div className="progress-track" role="progressbar" aria-label="Tỷ lệ hoàn thành" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{ width: `${percent}%` }} /></div></div><span className="progress-number">{percent}<small>%</small></span></section><div className="deadline-grid">{db.deadlines.map(d => <DeadlineCard key={d.id} deadline={d}><MutationForm operation="complete" id={d.id} className={`button ${completed.includes(d.id) ? 'secondary' : ''}`}>{completed.includes(d.id) ? '✓ Đã xong · Hoàn tác' : 'Đánh dấu đã xong'}</MutationForm></DeadlineCard>)}</div></>;
}
