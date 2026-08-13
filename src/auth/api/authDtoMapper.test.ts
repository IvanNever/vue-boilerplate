import { describe, expect, it } from 'vitest';
import { currentUserFromDto } from './authDtoMapper';
import { userDtoFixture } from '@/infrastructure/test-utils/fixtures/userDtoFixture';

describe('currentUserFromDto', () => {
  it('maps a user DTO to a domain User', () => {
    const dto = userDtoFixture({ id: 3, roles: [{ name: 'admin' }] });

    const user = currentUserFromDto(dto);

    expect(user.id).toBe(3);
    expect(user.role).toBe('admin');
  });

  it('throws when the DTO has no roles', () => {
    const dto = userDtoFixture({ roles: [] });
    expect(() => currentUserFromDto(dto)).toThrow();
  });
});
