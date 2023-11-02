import { RequestHandler } from "express";
import { ICreateUserDto, IUserDto } from "../dto/user.dto";
import { IErrorDto } from "../dto/error.dto";
import { ICredentialDto, ILoginDto } from "../dto/auth.dto";
import { AuthStatus } from "../middleware/jwt";

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
