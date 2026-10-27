import { NextRequest, NextResponse } from 'next/server';
import { createDeadline, deleteDeadline, toggleComplete } from '@/app/actions';
import { requirePermission } from '@/lib/access';
// Use a normal document POST and a 303 redirect. The underlying Server Actions
// remain the authorization/validation boundary; no Flight transition is needed.
export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) return new Response('Nguồn yêu cầu không hợp lệ.', { status: 403 });
  const form = await request.formData();
  const operation = form.get('operation');
  if (operation === 'complete') {
    await toggleComplete(form);
    return NextResponse.redirect(new URL('/dashboard', request.url), 303);
  }
  if (operation === 'delete') {
    await deleteDeadline(form);
    return NextResponse.redirect(new URL('/admin', request.url), 303);
  }
  if (operation === 'create') {
    await requirePermission('deadline:create', '/admin');
    const raw = String(form.get('localDate') || '');
    const valid = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw);
    const date = new Date(`${raw}:00+07:00`);
    form.set('dueDate', valid && !Number.isNaN(date.getTime()) ? date.toISOString() : '');
    const result = await createDeadline({}, form);
    const url = new URL('/admin', request.url);
    if (result.error) url.searchParams.set('error', result.error);
    return NextResponse.redirect(url, 303);
  }
  return new Response('Thao tác không hợp lệ.', { status: 400 });
}
