import { Content, PrismaClient } from "@prisma/client";
import { IContent, IContentRepository } from ".";
import {
  IContentDto,
  ICreateContentDto,
  UpdateContentDto,
} from "../dto/content.dto";

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
  public async getContentId(id: number): Promise<IContent> {
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
  public async partialUpdate(
    id: number,
    content: UpdateContentDto
  ): Promise<Content> {
    const updateInfoId = await this.prisma.content.update({
      data: content,
      where: { id },
    });
    return updateInfoId;
  }
  public async deleteContent(id: number): Promise<IContent> {
    const deletedInfo = await this.prisma.content.delete({
      where: { id },
      include: {
        User: true,
      },
    });
    return deletedInfo;
  }
}
