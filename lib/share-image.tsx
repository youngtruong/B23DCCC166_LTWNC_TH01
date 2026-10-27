import { ImageResponse } from 'next/og';
import { getDeadline, subjectName } from '@/lib/deadlines';
import { notFound } from 'next/navigation';
export const alt = 'Class Deadline Hub';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = false;
export default async function Image({ params }: { params: Promise<{id:string}> }) {
  const d = await getDeadline((await params).id); if (!d) notFound();
  return new ImageResponse(<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 70, background: '#e9f4ef', color: '#143d36', fontFamily: 'sans-serif' }}><div style={{ display: 'flex', fontSize: 28 }}>CLASS DEADLINE HUB · B23DCCC166</div><div style={{ display: 'flex', flexDirection: 'column' }}><div style={{ display: 'flex', fontSize: 28, color: '#16796a', marginBottom: 24 }}>{subjectName(d.subjectSlug)}</div><div style={{ display: 'flex', fontSize: 58, fontWeight: 700 }}>{d.title}</div></div><div style={{ display: 'flex', fontSize: 30 }}>Hạn nộp: {new Date(d.dueDate).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} · {new Date(d.dueDate).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' })}</div></div>, size);
}
