import Link from 'next/link';
export const metadata = { title: 'Không có quyền', robots: { index: false, follow: false } };
export default function Forbidden() { return <section className="detail"><p className="eyebrow">403</p><h1>Bạn không có quyền truy cập</h1><p>Chỉ lớp trưởng có thể quản lý deadline.</p><Link className="button" href="/dashboard">Về trang cá nhân</Link></section>; }
