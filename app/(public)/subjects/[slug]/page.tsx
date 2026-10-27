import { notFound } from 'next/navigation';
import { subjects, getDeadlines } from '@/lib/deadlines';
import Link from 'next/link';
import { DeadlineCard } from '@/components/hub/DeadlineCard';
export const dynamic = 'force-static';
export const dynamicParams = false;
export function generateStaticParams() { return subjects.map(s => ({ slug: s.slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }) { const { slug } = await params; const s = subjects.find(s => s.slug === slug); return { title: s?.name || 'Không tìm thấy', alternates: { canonical: `/subjects/${slug}` } }; }
export default async function Subject({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params; const subject = subjects.find(s => s.slug === slug); if (!subject) notFound();
  const deadlines = (await getDeadlines()).filter(d => d.subjectSlug === slug);
  return <><section className="detail"><p className="eyebrow">{subject.code} · MÔN HỌC</p><h1>{subject.name}</h1><p>{subject.description}</p><p>Thông tin môn học được tạo tĩnh khi build. Danh sách deadline mới nhất được cập nhật tại cổng deadline của lớp.</p><Link className="button" href={`/deadlines#${slug}`}>Xem deadline của lớp →</Link></section><div className="section-heading"><h2>Deadline của môn học</h2></div><div className="deadline-grid">{deadlines.map(d => <DeadlineCard key={d.id} deadline={d} />)}</div></>;
}
