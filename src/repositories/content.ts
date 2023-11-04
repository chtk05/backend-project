import { Content, PrismaClient } from "@prisma/client";
import { IContent, IContentRepository } from ".";
import { IContentDto, ICreateContentDto } from "../dto/content.dto";

export default class ContentRepository implements IContentRepository {
  constructor(private prisma: PrismaClient) {}
  public async createContent(
    id: string,
    content: IContentDto
  ): Promise<IContent> {
    return await this.prisma.content.create({
      data: {
        ...content,
        User: {
          connect: { id: id },
        },
      },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            name: true,
            registeredAt: true,
          },
        },
      },
    });
  }
  public async getContent(): Promise<IContent[]> {
    return await this.prisma.content.findMany({
      include: {
        User: {},
      },
    });
  }
  public async getById(id: number): Promise<IContent> {
    const infoById = await this.prisma.content.findUniqueOrThrow({
      include: {
        User: {
          select: {
            id: true,
            username: true,
            registeredAt: true,
            name: true,
          },
        },
      },
      where: { id },
    });
    return infoById;
  }
}
