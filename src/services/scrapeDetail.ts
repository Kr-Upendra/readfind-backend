import axios from "axios";
import * as cheerio from "cheerio";
import { Book, redisClient, RedisKeys } from "../utils";

export const scrapeDetail = async (bookId: string): Promise<Book> => {
  const bookDetailUrl = `https://www.bookshare.org/browse/book/${bookId}`;

  try {
    const { data: bookDetailData } = await axios.get(bookDetailUrl);
    const bookDetail = scrapeBooks(bookDetailData, bookDetailUrl, bookId);
    await redisClient.set(RedisKeys.bookId(bookId), JSON.stringify(bookDetail));

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
  $('span[itemprop="author"] span[itemprop="name"] a').each((i, el) => {
    const authorName = $(el).text().trim();
    authors.push(authorName);
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

// const scrapeBooks = (htmlData: string, url: string, id: string): Book => {
//   const $ = cheerio.load(htmlData);
//   const book: Book = {};

//   const title = $('h1.bookDetail[itemprop="name"]').text().trim();
//   const image = $("img.cover-image-book-detail").attr("src") || "";
//   const authors: string[] = [];
//   $('span[itemprop="author"] span[itemprop="name"] a').each((i, el) => {
//     const authorName = $(el).text().trim();
//     authors.push(authorName);
//   });
//   const description = $('dd[itemprop="description"]').text().trim();

//   const isbn13 = $('dd[itemprop="isbn"]').text().trim();
//   const numberOfPages = $('dt:contains("Book Size:")')
//     .next("dd")
//     .find('span[itemprop="numberOfPages"]')
//     .text()
//     .trim();
//   const relatedIsbns = $('dt:contains("Related ISBNs")')
//     .next("dd")
//     .text()
//     .trim();

//   const language = $('dt:contains("Language:")')
//     .next("dd")
//     .find('span[itemprop="inLanguage"]')
//     .text()
//     .trim();

//   const readingAge = $('dt:contains("Reading Age:")').next("dd").text().trim();

//   const adultContent = $('dd:contains("Adult content")').text().includes("Yes")
//     ? "Yes"
//     : "No";
//   const genres: string[] = [];
//   $('dd span[itemprop="keywords"]').each((i, el) => {
//     genres.push($(el).text().trim());
//   });
//   const publisher = $('dd[itemprop="publisher"] span[itemprop="name"]')
//     .text()
//     .trim();

//   console.log({
//     id,
//     url,
//     title,
//     image,
//     authors,
//     description,
//     publisher,
//     adultContent,
//     genres,
//     readingAge,
//     language,
//     isbn13,
//     numberOfPages,
//     relatedIsbns,
//   });

//   return book;
// };
