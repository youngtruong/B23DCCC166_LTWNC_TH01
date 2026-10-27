import type { DefaultSession } from 'next-auth';
import type { Role } from '@/lib/permissions';
declare module 'next-auth' {
  interface User { role: Exclude<Role, 'guest'> }
  interface Session { user: { id: string; role: Exclude<Role, 'guest'> } & DefaultSession['user'] }
}
declare module '@auth/core/jwt' { interface JWT { id: string; role: Exclude<Role, 'guest'> } }
