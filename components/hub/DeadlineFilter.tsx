'use client';
import { useState } from 'react';
export function DeadlineFilter({ items }: { items: { id: string; subjectSlug: string; node: React.ReactNode }[] }) {
  const [subject, setSubject] = useState('all');
  const names = [['all','Tất cả môn học'],['lap-trinh-web-nang-cao','Web nâng cao'],['co-so-du-lieu','Cơ sở dữ liệu'],['an-toan-mang','An toàn mạng'],['tri-tue-nhan-tao','Trí tuệ nhân tạo']];
  return <><div className="filter-tabs" role="group" aria-label="Lọc môn học">{names.map(([slug,name]) => <button type="button" key={slug} className="filter-tab" data-active={subject === slug} aria-pressed={subject === slug} onClick={() => setSubject(slug)}>{name}</button>)}</div><div className="deadline-grid">{items.filter(d => subject === 'all' || d.subjectSlug === subject).map(d => <div key={d.id}>{d.node}</div>)}</div>{!items.some(d => subject === 'all' || d.subjectSlug === subject) && <p>Chưa có deadline cho môn học này.</p>}</>;
}
