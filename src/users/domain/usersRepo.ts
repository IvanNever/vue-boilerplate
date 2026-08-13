import type { User } from './User';

export interface UsersRepo {
  getUsers(): Promise<User[]>;
}
