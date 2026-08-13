import { User } from '@/users/domain/User';

export function userFixture(
  overrides: Partial<{
    id: number;
    email: string;
    role: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
  }> = {}
): User {
  const {
    id = 1,
    email = 'user@example.com',
    role = 'admin',
    username = 'testuser',
    createdAt = new Date('2024-01-01T00:00:00.000Z'),
    updatedAt = new Date('2024-01-02T00:00:00.000Z')
  } = overrides;

  return new User(email, role, username, createdAt, updatedAt, id);
}
