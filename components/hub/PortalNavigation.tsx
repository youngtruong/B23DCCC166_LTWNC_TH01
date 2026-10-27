'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, CircleUserRound, ShieldCheck, ChevronRight } from 'lucide-react';
const links = [ {href:'/',label:'Tổng quan',mobile:'Tổng quan',icon:LayoutDashboard}, {href:'/deadlines',label:'Deadline của lớp',mobile:'Deadline',icon:CalendarDays}, {href:'/dashboard',label:'Không gian cá nhân',mobile:'Cá nhân',icon:CircleUserRound}, {href:'/admin',label:'Quản lý deadline',mobile:'Quản lý',icon:ShieldCheck} ];
export function PortalNavigation() {
  const pathname = usePathname();
  return <nav className="portal-navigation" aria-label="Điều hướng chính">{links.map(({href,label,mobile,icon:Icon}) => { const active = href === '/' ? pathname === '/' || pathname.startsWith('/subjects/') : pathname.startsWith(href); return <Link href={href} key={href} aria-current={active ? 'page' : undefined}><Icon size={19} strokeWidth={1.7} /><span className="nav-label-desktop">{label}</span><span className="nav-label-mobile">{mobile}</span>{active && <ChevronRight size={15} className="nav-chevron" />}</Link>; })}</nav>;
}
