import { User } from "@prisma/client";
import { ICreateUserDto, IUserDto } from "../dto/user.dto";

export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}
// export interface IUser Pick<User,"id","username","name","registeredAt"> {} pcik type directly from User in prisma

export interface IUserRepository {
  create(user: ICreateUserDto): Promise<IUser>;
  findByUsername(username: string): Promise<User>;
}
