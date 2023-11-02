import { RequestHandler, json } from "express";
import { IUserHandler } from ".";
import { IUser, IUserRepository, UserCreationError } from "../repositories";
import { ICreateUserDto, IUserDto } from "../dto/user.dto";
import { IErrorDto } from "../dto/error.dto";
import { hash } from "bcryptjs";
import { hashPassword } from "../utils/bcrypt";

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
      if (error instanceof UserCreationError) {
        const columnName = `${error}`.replace("Unique", "");
        return res.status(500).json({
          message: `${error.column} is invalid`,
        });
      }
      return res.status(500).json({
        message: `Internal Server Error`,
      });
    }
  };
}
