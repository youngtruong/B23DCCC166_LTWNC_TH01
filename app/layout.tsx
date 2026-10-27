import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
const font = Be_Vietnam_Pro({ subsets: ['vietnamese', 'latin'], weight: ['400','500','600','700','800'], display: 'swap' });
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Class Deadline Hub · B23DCCC166', template: '%s | Class Deadline Hub' },
  description: 'Cổng deadline công khai của lớp B23DCCC166. Theo dõi hạn nộp, môn học và tiến độ học tập.',
  icons: { icon: '/hub-mark.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="vi"><body className={font.className}>{children}</body></html>; }
