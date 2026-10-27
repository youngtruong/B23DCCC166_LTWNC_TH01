import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDeadline, getDeadlines, subjectName } from '@/lib/deadlines';
import { Countdown } from '@/components/hub/Countdown';
export const revalidate = false;
export const dynamicParams = true;
export async function generateStaticParams() { return (await getDeadlines()).map(d => ({ id: d.id })); }
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params; const d = await getDeadline(id); if (!d) notFound();
  return { title: d.title, description: d.description, alternates: { canonical: `/deadlines/${id}` }, openGraph: { title: d.title, description: d.description, locale: 'vi_VN', type: 'article', url: `/deadlines/${id}`, images: [{ url: `/deadlines/${id}/share`, width: 1200, height: 630 }] }, twitter: { card: 'summary_large_image', title: d.title, images: [`/deadlines/${id}/share`] } };
}
export default async function Detail({ params }: Props) {
  const { id } = await params; const d = await getDeadline(id); if (!d) notFound();
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const jsonLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Trang chủ', item: base }, { '@type': 'ListItem', position: 2, name: 'Deadline', item: `${base}/deadlines` }, { '@type': 'ListItem', position: 3, name: d.title, item: `${base}/deadlines/${id}` }] };
  return <article className="detail"><nav className="breadcrumb" aria-label="Đường dẫn"><Link href="/">Trang chủ</Link> / <Link href="/deadlines">Deadline</Link> / #{id}</nav><p className="eyebrow">{subjectName(d.subjectSlug)}</p><h1>{d.title}</h1><div className="detail-meta"><time dateTime={d.dueDate}>Hạn nộp: {new Date(d.dueDate).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</time><Countdown dueDate={d.dueDate} /></div><h2>Yêu cầu bài tập</h2><p className="description">{d.description}</p><Link href="/dashboard" className="button">Theo dõi tiến độ của tôi →</Link><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} /></article>;
}
