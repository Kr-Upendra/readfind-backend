import * as cheerio from "cheerio";
import { Book } from "./interfaces";

export const scrapeBookList = (htmlData: string): Book[] => {
  const $ = cheerio.load(htmlData);
  const books: Book[] = [];

  $("div.resultsBook").each((_, element) => {
    const authors: string[] = [];
    const title = $(element).find("h2.bookTitle a").text().trim();
    const imageUrl =
      $(element).find("img.cover-image-search-list").attr("src") || "";
    $(element)
      .find("span.bookAuthor a")
      .each((_i, el) => {
        const authorName = $(el).text().trim();
        const cleanAuthorName = authorName.includes("null")
          ? authorName.split("null ")[1]
          : authorName;
        authors.push(cleanAuthorName);
      });

    const bookUrl = $(element).find("h2.bookTitle a").eq(1).attr("href") || "";
    const id =
      $(element).find("h2.bookTitle a").eq(0).attr("name")?.split("-")[1] || "";

    const image = imageUrl.includes("SMALL")
      ? imageUrl.replace("SMALL", "MEDIUM")
      : imageUrl;

    const author = authors.join(", ");
    books.push({ id, title, image, author, url: bookUrl });
  });

  return books;
};
