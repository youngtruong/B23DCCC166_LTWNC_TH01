import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { scryptSync, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import users from '@/data/users.json';
import type { Role } from '@/lib/permissions';
const schema = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(128) });
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [Credentials({ credentials: { email: {}, password: {} }, authorize(raw) {
    const parsed = schema.safeParse(raw); if (!parsed.success) return null;
    const user = users.find(u => u.email === parsed.data.email.toLowerCase());
    if (!user) return null;
    const hash = scryptSync(parsed.data.password, user.salt, 64);
    if (!timingSafeEqual(hash, Buffer.from(user.passwordHash, 'hex'))) return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role as Exclude<Role, 'guest'> };
  } })],
  callbacks: {
    jwt({ token, user }) { if (user) { token.id = user.id!; token.role = user.role; } return token; },
    session({ session, token }) { session.user.id = token.id; session.user.role = token.role; return session; },
  },
});
