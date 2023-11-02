import { RequestHandler, json } from "express";
import { IUserHandler } from ".";
import { IUser, IUserRepository } from "../repositories";
import { ICreateUserDto, ILoginDto, IUserDto } from "../dto/user.dto";
import { IErrorDto } from "../dto/error.dto";
import { hash } from "bcryptjs";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../const";
import { ICredentialDto } from "../dto/auth.dto";
import { AuthStatus } from "../middleware/jwt";

export default class UserHandler implements IUserHandler {
  //   constructor(private repo: IUserRepository);
  constructor(private repo: IUserRepository) {}
  public registration: RequestHandler<
    {},
    IUserDto | IErrorDto,
    ICreateUserDto
  > = async (req, res) => {
    try {
      const { name, username, password: plainPassword } = req.body;
      // const plainPassword = req.body.password;
      if (typeof name !== "string" || name.length === 0) {
        return res.status(400).json({ message: "name cannot be empty" });
      }
      if (typeof username !== "string" || username.length === 0) {
        return res.status(400).json({ message: "username cannot be empty" });
      }
      if (typeof plainPassword !== "string" || plainPassword.length < 5) {
        return res
          .status(400)
          .json({ message: "password length should not less than 5" });
      }
      const {
        id: registeredId,
        name: registeredName,
        registeredAt,
        username: createdUsername,
      } = await this.repo.create({
        name,
        username,
        password: hashPassword(plainPassword),
      });
      return res
        .status(201)
        .json({
          id: registeredId,
          name: registeredName,
          registeredAt: `${registeredAt}`,
          username: registeredName,
        })
        .end();
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res.status(500).json({
          message: `name is invalid`,
        });
      }
      return res.status(500).json({
        message: `Internal Server Error`,
      });
    }
  };
  public login: RequestHandler<{}, ICredentialDto | IErrorDto, ILoginDto> =
    async (req, res) => {
      const { username, password: plainPassword } = req.body;
      try {
        // const userInfo = await this.repo.findByUsername(username);
        const { password, id } = await this.repo.findByUsername(username);
        if (!verifyPassword(plainPassword, password))
          throw new Error("Invalid username or passsword");
        const accessToken = sign({ id }, JWT_SECRET, {
          algorithm: "HS512",
          expiresIn: "12h",
          issuer: "learnhub-api",
          subject: "user-credential",
        });
        return res.status(200).json({ accessToken }).end();
      } catch (error) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" })
          .end();
      }
      const userInfo = await this.repo.findByUsername(username);
    };
  public selfcheck: RequestHandler<
    {},
    IUserDto | IErrorDto,
    unknown,
    unknown,
    AuthStatus
  > = async (req, res) => {
    try {
      const { registeredAt, ...otherInfo } = await this.repo.findById(
        res.locals.user.id
      );

      return res
        .status(200)
        .json({ ...otherInfo, registeredAt: registeredAt.toISOString() })
        .end();
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  };
}
