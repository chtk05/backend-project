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
  //   public async findById(id: string): Promise<IContent> {
  //     return;
  //   }
}
