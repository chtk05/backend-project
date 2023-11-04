import { Content, User } from "@prisma/client";
import { ICreateUserDto, IUserDto } from "../dto/user.dto";
import { IContentDto, ICreateContentDto } from "../dto/content.dto";

export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}
// export interface IUser Pick<User,"id","username","name","registeredAt"> {} pcik type directly from User in prisma
export interface IContent extends Content {
  User: IUser;
}

export interface ICreateContent {
  creatorName: string;
  creatorUrl: string;
  thumbnailUrl: string;
  videoTitle: string;
  videoUrl: string;
  comment: string;
  rating: number;
}
export interface IUserRepository {
  create(user: ICreateUserDto): Promise<IUser>;
  findByUsername(username: string): Promise<User>;
  findById(id: string): Promise<IUser>;
}

export interface IContentRepository {
  createContent(id: string, content: ICreateContent): Promise<IContent>;
  // findById(id: string): Promise<IContent>;
}
