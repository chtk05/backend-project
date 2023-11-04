import { RequestHandler } from "express";
import { IContentHandler } from ".";
import { IContentDto, ICreateContentDto } from "../dto/content.dto";
import { IErrorDto } from "../dto/error.dto";
import { AuthStatus } from "../middleware/jwt";
import { IContentRepository } from "../repositories";
import { embedUrl } from "../utils/ombed";

export default class ContentHandler implements IContentHandler {
  constructor(private repo: IContentRepository) {}
  //   public selfcheck: RequestHandler<
  //     {},
  //     ICreateContentDto | IErrorDto,
  //     unknown,
  //     unknown,
  //     AuthStatus
  //   > = async (req, res) => {
  //     try {
  //       const result = await this.repo.findById(res.locals.user.id);
  //       return res.status(200).json(result).end();
  //     } catch (error) {
  //       console.error(error);
  //       return res.status(500).send({ message: "Internal server error" });
  //     }
  //   };
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
}
