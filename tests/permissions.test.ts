import { can, type Role, type Action } from '@/lib/permissions';
const roles: Role[] = ['guest', 'user', 'admin'];
const cases: [Action, boolean[]][] = [
  ['deadline:read', [true, true, true]],
  ['deadline:complete', [false, true, true]],
  ['deadline:create', [false, false, true]],
  ['deadline:delete', [false, false, true]],
];
describe('Ma trận phân quyền Class Deadline Hub', () => {
  test.each(cases)('%s', (action, expected) => {
    roles.forEach((role, index) => expect(can(role, action)).toBe(expected[index]));
  });
});
