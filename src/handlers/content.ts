import { RequestHandler } from "express";
import { IContentHandler, Id } from ".";
import { IContentDto, ICreateContentDto } from "../dto/content.dto";
import { IErrorDto } from "../dto/error.dto";
import { AuthStatus } from "../middleware/jwt";
import { IContent, IContentRepository } from "../repositories";
import { embedUrl } from "../utils/ombed";

export default class ContentHandler implements IContentHandler {
  constructor(private repo: IContentRepository) {}

  public create: RequestHandler<
    {},
    IContentDto | IErrorDto,
    ICreateContentDto
  > = async (req, res) => {
    const { rating, videoUrl, comment } = req.body;
    const { author_name, author_url, thumbnail_url, title } = await embedUrl(
      videoUrl
    );
    const newContent = await this.repo.createContent(res.locals.user.id, {
      rating,
      videoUrl,
      comment,
      creatorName: author_name,
      creatorUrl: author_url,
      thumbnailUrl: thumbnail_url,
      videoTitle: title,
    });

    const returnedContent: IContentDto = {
      ...newContent,

      postedBy: newContent.User,
    };

    return res
      .status(200)
      .json({ ...returnedContent })
      .end();
  };
  public getAll: RequestHandler<{}, IContent[] | IErrorDto> = async (
    req,
    res
  ) => {
    const contentInfo = await this.repo.getContent();
    return res.status(200).json(contentInfo).end();
  };
  public getContentById: RequestHandler<Id, IContent | IErrorDto> = async (
    req,
    res
  ) => {
    try {
      const idInfo = await this.repo.getById(Number(req.params.id));
      if (idInfo === null)
        return res.status(404).json({ message: "Content not found" }).end();
      return res.status(200).json(idInfo).end();
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" }).end();
    }
  };
}
