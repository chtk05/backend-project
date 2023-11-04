import { IUser } from "../repositories";

export interface ICreateContentDto {
  videoUrl: string;
  comment: string;
  rating: number;
}

export interface IContentDto extends ICreateContentDto {
  creatorName: string;
  creatorUrl: string;
  thumbnailUrl: string;
  videoTitle: string;
  postedBy: IUser;
  createdAt: Date;
  updatedAt: Date;
}
