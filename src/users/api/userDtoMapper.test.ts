import { describe, expect, it } from 'vitest';
import { userFromDto } from './userDtoMapper';
import { userDtoFixture } from '@/infrastructure/test-utils/fixtures/userDtoFixture';

describe('userFromDto', () => {
  it('maps a user DTO to a domain User', () => {
    const dto = userDtoFixture({
      id: 7,
      email: 'a@b.com',
      username: 'abuser',
      roles: [{ name: 'editor' }]
    });

    const user = userFromDto(dto);

    expect(user.id).toBe(7);
    expect(user.email).toBe('a@b.com');
    expect(user.username).toBe('abuser');
    expect(user.role).toBe('editor');
    expect(user.createdAt).toBe(dto.createdAt);
    expect(user.updatedAt).toBe(dto.updatedAt);
  });

  it('uses the first role when multiple roles are present', () => {
    const dto = userDtoFixture({
      roles: [{ name: 'admin' }, { name: 'editor' }]
    });

    expect(userFromDto(dto).role).toBe('admin');
  });

  it('throws when the DTO has no roles', () => {
    const dto = userDtoFixture({ roles: [] });
    expect(() => userFromDto(dto)).toThrow();
  });
});
