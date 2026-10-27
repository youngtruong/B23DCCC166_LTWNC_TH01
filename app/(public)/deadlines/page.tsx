import { getDeadlines } from '@/lib/deadlines';
import { DeadlineCard } from '@/components/hub/DeadlineCard';
import { DeadlineFilter } from '@/components/hub/DeadlineFilter';
export const revalidate = 60;
export const metadata = { title: 'Deadline của lớp', alternates: { canonical: '/deadlines' } };
export default async function Deadlines() {
  const deadlines = await getDeadlines();
  return <><div className="page-heading"><p className="eyebrow">CÙNG NHAU VỀ ĐÍCH</p><h1>Deadline của lớp</h1><p>{deadlines.length} deadline · Theo dõi hạn nộp và lên kế hoạch học tập</p></div><DeadlineFilter items={deadlines.map(d => ({ id: d.id, subjectSlug: d.subjectSlug, node: <DeadlineCard deadline={d} /> }))} /></>;
}
