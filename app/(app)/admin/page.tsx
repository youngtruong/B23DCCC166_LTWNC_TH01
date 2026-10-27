import { requirePermission } from '@/lib/access';
import { getDeadlines, subjects } from '@/lib/deadlines';
import { CreateForm } from '@/components/hub/CreateForm';
import { DeadlineCard } from '@/components/hub/DeadlineCard';
import { MutationForm } from '@/components/hub/MutationForm';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Quản lý deadline' };
export default async function Admin({ searchParams }: { searchParams: Promise<{error?: string}> }) {
  await requirePermission('deadline:create', '/admin');
  const deadlines = await getDeadlines();
  const { error } = await searchParams;
  return <><div className="page-heading"><p className="eyebrow">DÀNH CHO LỚP TRƯỞNG</p><h1>Quản lý deadline</h1><p>Thêm, xoá và cập nhật lịch nộp bài cho cả lớp.</p></div><div className="admin-layout"><aside className="hub-card"><CreateForm subjects={subjects} error={error} /></aside><section className="admin-list">{deadlines.map(d => <DeadlineCard key={d.id} deadline={d}><MutationForm operation="delete" id={d.id} className="button danger">Xoá deadline</MutationForm></DeadlineCard>)}</section></div></>;
}
