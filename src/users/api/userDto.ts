export type UserRoleDto = {
  name: string;
};

export type UserDto = {
  id?: number;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  roles: UserRoleDto[];
};
