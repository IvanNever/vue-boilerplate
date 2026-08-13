import type { UserDto } from '@/users/api/userDto';

export function userDtoFixture(overrides: Partial<UserDto> = {}): UserDto {
  return {
    id: 1,
    email: 'user@example.com',
    username: 'testuser',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    roles: [{ name: 'admin' }],
    ...overrides
  };
}
