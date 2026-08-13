import { BaseRepo } from '@/infrastructure/api/BaseRepo';
import type { AuthRepo } from '@/auth/domain/AuthRepo';
import type { Token } from '@/auth/domain/Token';
import type { User } from '@/users/domain/User';
import { currentUserFromDto } from '@/auth/api/authDtoMapper';

const baseUrl: string = `${import.meta.env.VITE_API_BASE_URL}/auth`;

export class AuthRepoImpl extends BaseRepo implements AuthRepo {
  async signIn({
    email,
    password
  }: {
    email: string;
    password: string;
  }): Promise<{ token: Token; user: User }> {
    const res = await this.inst.post(`${baseUrl}/sign-in`, { email, password });
    const { user, token } = res.data;

    return { token, user: currentUserFromDto(user) };
  }

  async getCurrentUser(): Promise<User> {
    const res = await this.inst.get(`${baseUrl}/current`);
    return currentUserFromDto(res.data);
  }

  async updateCurrentUserPassword(password: string): Promise<void> {
    await this.inst.patch(`${baseUrl}/password`, { password });
  }
}

export const authRepo: AuthRepo = new AuthRepoImpl();
