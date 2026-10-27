import { Navigation } from '@/components/hub/Navigation';
export default function DashboardLayout({ children }: { children: React.ReactNode }) { return <div className="dashboard-layout"><aside className="hub-sidebar"><p className="eyebrow">KHÔNG GIAN CÁ NHÂN</p><Navigation sidebar /></aside><div>{children}</div></div>; }
