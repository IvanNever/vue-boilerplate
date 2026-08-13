import type { Token } from '@/auth/domain/Token';
import type { User } from '@/users/domain/User';

export interface AuthRepo {
  signIn(credentials: {
    email: string;
    password: string;
  }): Promise<{ token: Token; user: User }>;
  getCurrentUser(): Promise<User>;
  updateCurrentUserPassword(password: string): Promise<void>;
}
