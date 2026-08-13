import { BaseRepo } from '@/infrastructure/api/BaseRepo';
import { userFromDto } from './userDtoMapper';
import { User } from '../domain/User';
import type { UsersRepo } from '../domain/usersRepo';
import type { UserDto } from './userDto';

const baseUrl: string = `${import.meta.env.VITE_API_BASE_URL}/users`;

export class UsersRepoImpl extends BaseRepo implements UsersRepo {
  async getUsers(): Promise<User[]> {
    const res = await this.inst.get<UserDto[]>(baseUrl);
    return res.data.map((item) => userFromDto(item));
  }
}

export const usersRepo: UsersRepo = new UsersRepoImpl();
