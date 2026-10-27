import Link from 'next/link';
import type { Deadline } from '@/lib/deadlines';
import { subjectName } from '@/lib/deadlines';
import { Countdown } from './Countdown';
export function DeadlineCard({ deadline, children }: { deadline: Deadline; children?: React.ReactNode }) {
  return <article className="hub-card"><div className="card-top"><Link className="subject-link" href={`/subjects/${deadline.subjectSlug}`}>{subjectName(deadline.subjectSlug)}</Link><span className={`priority priority-${deadline.priority}`}>{({ high: 'Ưu tiên cao', medium: 'Trung bình', low: 'Ưu tiên thấp' })[deadline.priority]}</span></div><h2><Link href={`/deadlines/${deadline.id}`}>{deadline.title}</Link></h2><p>{deadline.description}</p><div className="card-bottom"><time dateTime={deadline.dueDate}>{new Date(deadline.dueDate).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} · {new Date(deadline.dueDate).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' })}</time><Countdown dueDate={deadline.dueDate} /></div>{children}</article>;
}
