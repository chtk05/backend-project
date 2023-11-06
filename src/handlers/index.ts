import { RequestHandler } from "express";
import { ICreateUserDto, IUserDto } from "../dto/user.dto";
import { IErrorDto } from "../dto/error.dto";
import { ICredentialDto, ILoginDto } from "../dto/auth.dto";
import { AuthStatus } from "../middleware/jwt";
import {
  IContentDto,
  ICreateContentDto,
  UpdateContentDto,
} from "../dto/content.dto";
import { IContent, IUpdate } from "../repositories";
import { Content } from "@prisma/client";

export interface IUserHandler {
  registration: RequestHandler<{}, IUserDto | IErrorDto, ICreateUserDto>;
  login: RequestHandler<{}, ICredentialDto | IErrorDto, ILoginDto>;
  selfcheck: RequestHandler<
    {},
    IUserDto | IErrorDto,
    unknown,
    unknown,
    AuthStatus
  >;
}
export interface Id {
  id: number;
}
export interface IContentHandler {
  create: RequestHandler<{}, IContentDto | IErrorDto, ICreateContentDto>;
  getAll: RequestHandler<{}, IContent[] | IErrorDto>;
  getContentById: RequestHandler<Id, IContent | IErrorDto>;
  updateById: RequestHandler<Id, Content | IErrorDto, UpdateContentDto>;
  deleteById: RequestHandler<
    Id,
    IContent | IErrorDto,
    undefined,
    undefined,
    AuthStatus
  >;
}
