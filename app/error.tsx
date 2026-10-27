'use client';
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <section className="hub-main detail"><h1>Không thể tải dữ liệu</h1><p>Đã có lỗi xảy ra. Vui lòng thử lại.</p><button className="button" onClick={reset}>Thử lại</button></section>; }
