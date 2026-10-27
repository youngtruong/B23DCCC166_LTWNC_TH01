import Link from 'next/link';
export default function NotFound() { return <main className="hub-main detail"><p className="eyebrow">404</p><h1>Không tìm thấy trang</h1><p>Deadline không tồn tại hoặc đã được lớp trưởng xoá.</p><Link className="button" href="/deadlines">Về danh sách deadline</Link></main>; }
