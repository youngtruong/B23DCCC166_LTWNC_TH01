export type Role = 'guest' | 'user' | 'admin';
export type Action = 'deadline:read' | 'deadline:complete' | 'deadline:create' | 'deadline:delete';
export const permissions: Record<Role, readonly Action[]> = {
  guest: ['deadline:read'],
  user: ['deadline:read', 'deadline:complete'],
  admin: ['deadline:read', 'deadline:complete', 'deadline:create', 'deadline:delete'],
};
export function can(role: Role, action: Action): boolean { return permissions[role].includes(action); }
