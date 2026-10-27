'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { ArrowUpRight, LayoutGrid, LogOut, ShieldCheck } from 'lucide-react';
import { logout } from '@/app/actions';
export function Navigation({ sidebar = false }: { sidebar?: boolean }) {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => { let active = true; getSession().then(s => { if (active) setSession(s); }).catch(() => {}); return () => { active = false; }; }, [pathname]);
  const links = sidebar ? [['/dashboard', 'Deadline của tôi'], ['/admin', 'Quản lý lớp']] : [['/', 'Tổng quan'], ['/deadlines', 'Deadline'], ['/dashboard', 'Cá nhân']];
  return <><nav className={sidebar ? 'side-nav' : 'hub-nav'} aria-label={sidebar ? 'Cá nhân' : 'Điều hướng chính'}>{links.map(([href,label]) => <Link href={href} key={href} aria-current={(href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'page' : undefined}>{sidebar && (href === '/admin' ? <ShieldCheck size={17} /> : <LayoutGrid size={17} />)}{label}</Link>)}</nav>{!sidebar && <div className="account">{session ? <><span className="account-avatar" aria-hidden="true">{session.user.name?.charAt(0)}</span><span className="account-name">{session.user.name}<small>{session.user.role === 'admin' ? 'Lớp trưởng · admin' : 'Sinh viên · user'}</small></span><form action={logout}><button className="button secondary logout-button"><LogOut size={15} /> Đăng xuất</button></form></> : <Link className="button header-login" href="/login">Đăng nhập <ArrowUpRight size={16} /></Link>}</div>}</>;
}
