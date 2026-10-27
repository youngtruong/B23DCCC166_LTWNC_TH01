'use client';
import { useActionState } from 'react';
import { login } from '@/app/actions';
export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action, pending] = useActionState(login, {});
  return <form action={action} className="hub-form"><input type="hidden" name="callbackUrl" value={callbackUrl} /><label>Email<input type="email" name="email" autoComplete="username" required /></label><label>Mật khẩu<input type="password" name="password" autoComplete="current-password" required /></label>{state.error && <p role="alert" className="form-error">{state.error}</p>}<button className="button" disabled={pending}>{pending ? 'Đang đăng nhập…' : 'Đăng nhập'}</button></form>;
}
