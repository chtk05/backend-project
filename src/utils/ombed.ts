import { ombedDto } from "../dto/ombed.dto";
import axios from "axios";

export const embedUrl = async (url: string): Promise<ombedDto> => {
  const videoInfo = await axios.get<ombedDto>(
    `https://noembed.com/embed?url=${url}`
  );
  const embedResult = videoInfo.data;
  console.log(embedResult);
  const { author_name, author_url, thumbnail_url, title } = embedResult;
  console.log(author_name, author_url, thumbnail_url, title);
  return {
    author_name,
    author_url,
    thumbnail_url,
    title,
  };
};
