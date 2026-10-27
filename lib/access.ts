import 'server-only';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { can, type Action } from '@/lib/permissions';
export async function requirePermission(action: Action, returnTo: string) {
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=${encodeURIComponent(returnTo)}`);
  if (!can(session.user.role, action)) redirect('/403');
  return session.user;
}
