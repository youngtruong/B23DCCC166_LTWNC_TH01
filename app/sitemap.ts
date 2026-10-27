import type { MetadataRoute } from 'next';
import { getDeadlines, subjects } from '@/lib/deadlines';
export const revalidate = 60;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; return ['','/deadlines',...subjects.map(s => `/subjects/${s.slug}`),...(await getDeadlines()).map(d => `/deadlines/${d.id}`)].map(p => ({ url: base + p })); }
