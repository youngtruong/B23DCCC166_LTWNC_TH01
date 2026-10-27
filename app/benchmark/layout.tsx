import { Providers } from '@/app/providers';
export const metadata = { robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) { return <Providers>{children}</Providers>; }
