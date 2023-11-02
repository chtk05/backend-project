import { RequestHandler } from "express";
import { ICreateUserDto, IUserDto } from "../dto/user.dto";
import { IErrorDto } from "../dto/error.dto";
import { ILoginDto } from "../dto/auth.dto";

export interface IUserHandler {
  registration: RequestHandler<{}, IUserDto | IErrorDto, ICreateUserDto>;
  //   login: RequestHandler<{}, unknown, ILoginDto>;
}
