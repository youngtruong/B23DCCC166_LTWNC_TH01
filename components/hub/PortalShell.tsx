import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, GraduationCap } from 'lucide-react';
import { Header } from './Header';
import { PortalNavigation } from './PortalNavigation';
export function PortalShell({ children }: { children: React.ReactNode }) {
  return <div className="portal-frame"><a className="skip-link" href="#main-content">Đến nội dung chính</a><aside className="portal-sidebar"><Link className="portal-brand" href="/"><Image src="/hub-mark.svg" alt="" width={42} height={42} /><span><strong>ClassHub<span>.</span></strong><small>CLASS DEADLINE HUB</small></span></Link><div className="sidebar-caption">KHÔNG GIAN LỚP HỌC</div><PortalNavigation /><div className="sidebar-class"><span className="sidebar-class-icon"><GraduationCap size={23} /></span><strong>B23DCCC166</strong><p>Học viện Công nghệ<br />Bưu chính Viễn thông</p><span className="semester-tag">Học kỳ I · 2026–2027</span></div><div className="sidebar-bottom"><span className="online-dot" /> Cùng lớp, cùng tiến bộ.<ArrowUpRight size={14} /></div></aside><div className="portal-body"><Header /><main className="hub-main" id="main-content">{children}</main><footer className="hub-footer"><span>Class Deadline Hub <span className="footer-divider">/</span> B23DCCC166</span><span>Học tập chủ động. Kết nối cùng lớp.</span></footer></div></div>;
}
