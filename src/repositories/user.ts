import { PrismaClient, User } from "@prisma/client";
import { IUser, IUserRepository } from ".";
import { ICreateUserDto, IUserDto } from "../dto/user.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default class UserReposiroty implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  public async create(user: ICreateUserDto): Promise<IUser> {
    //return await this.prisma.create

    const createuser = await this.prisma.user.create({
      data: user,
      select: {
        id: true,
        name: true,
        username: true,
        registeredAt: true,
      },
    });
    return createuser;
  }
  public async findByUsername(username: string): Promise<User> {
    const loginSuccess = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (loginSuccess === null)
      throw new Error(`Username : ${username} not found`);
    return loginSuccess;
  }
}
