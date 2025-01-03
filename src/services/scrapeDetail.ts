import axios from "axios";
import * as cheerio from "cheerio";
import { Book, redisClient, RedisKeys } from "../utils";

export const scrapeDetail = async (bookId: string): Promise<Book> => {
  const baseWebsiteUrl = process.env.BASE_SCRAPE_WEBSITE_URL;
  const bookDetailUrl = `${baseWebsiteUrl}browse/book/${bookId}`;
  const { key, expTime } = RedisKeys.bookId(bookId);

  try {
    const { data: bookDetailData } = await axios.get(bookDetailUrl);
    const bookDetail = scrapeBooks(bookDetailData, bookDetailUrl, bookId);
    await redisClient.set(key, JSON.stringify(bookDetail), "EX", expTime);

    console.log("Scraping completed and data stored in Redis.");
    return bookDetail;
  } catch (error) {
    console.error("Error scraping the webpage:", error);
    throw new Error("Failed to scrape data.");
  }
};

const scrapeBooks = (htmlData: string, url: string, id: string): Book => {
  const $ = cheerio.load(htmlData);

  const book: Book = {
    id,
    url,
    title: $('h1.bookDetail[itemprop="name"]').text().trim(),
    image: $("img.cover-image-book-detail").attr("src") || "",
    author: "",
    description: $('dd[itemprop="description"]').text().trim(),
    publisher: $('dd[itemprop="publisher"] span[itemprop="name"]')
      .text()
      .trim(),
    adultContent: "No",
    genres: [],
    readingAge: $('dt:contains("Reading Age:")').next("dd").text().trim(),
    language: $('dt:contains("Language:")')
      .next("dd")
      .find('span[itemprop="inLanguage"]')
      .text()
      .trim(),
    isbn13: $('dd[itemprop="isbn"]').text().trim(),
    isbns: "",
    numberOfPages: $('dt:contains("Book Size:")')
      .next("dd")
      .find('span[itemprop="numberOfPages"]')
      .text()
      .trim(),
  };

  const authors: string[] = [];
  $('span[itemprop="author"] span[itemprop="name"] a').each((_i, el) => {
    const authorName = $(el).text().trim();
    const cleanAuthorName = authorName.includes("null")
      ? authorName.split("null ")[1]
      : authorName;
    authors.push(cleanAuthorName);
  });

  book.author = authors.join(", ");

  const adultContentText = $('dd:contains("Adult content")').text();
  if (adultContentText.includes("Yes")) {
    book.adultContent = "Yes";
  }

  const relatedIsbns = $('dt:contains("Related ISBNs")')
    .next("dd")
    .text()
    .trim();
  if (relatedIsbns) {
    book.isbns = relatedIsbns;
  }

  $('dd span[itemprop="keywords"]').each((_, el) => {
    book.genres!.push($(el).text().trim());
  });

  return book;
};
