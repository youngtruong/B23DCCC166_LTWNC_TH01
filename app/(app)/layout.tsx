import type { Metadata } from 'next';
import { PortalShell } from '@/components/hub/PortalShell';
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function AppLayout({ children }: { children: React.ReactNode }) { return <PortalShell>{children}</PortalShell>; }
