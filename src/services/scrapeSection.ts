import axios from "axios";
import * as cheerio from "cheerio";
import { Book, redisClient, RedisKeys } from "../utils";

export const scrapeSections = async () => {
  const baseWebsiteUrl = process.env.BASE_SCRAPE_WEBSITE_URL;
  const popularBooksUrl = `${baseWebsiteUrl}discover/popular/MONTH?resultsView=LIST`;
  const newBooksUrl = `${baseWebsiteUrl}discover/newOnBookshare?resultsView=LIST`;
  const teensBooksUrl = `${baseWebsiteUrl}discover/popular/Teens?resultsView=LIST`;

  try {
    const cachedNewBooks = await redisClient.get(RedisKeys.newBooks.key);
    const cachedPopularBooks = await redisClient.get(
      RedisKeys.popularBooks.key
    );
    const cachedTeensBooks = await redisClient.get(RedisKeys.teensBooks.key);
    let newBooks = cachedNewBooks ? JSON.parse(cachedNewBooks) : null;
    let popularBooks = cachedPopularBooks
      ? JSON.parse(cachedPopularBooks)
      : null;
    let teensBook = cachedTeensBooks ? JSON.parse(cachedTeensBooks) : null;

    if (!newBooks) {
      console.log("New books data not in cache. Scraping new books...");
      const { data: newBookData } = await axios.get(newBooksUrl);
      newBooks = scrapeBooks(newBookData);
      await redisClient.set(
        RedisKeys.newBooks.key,
        JSON.stringify(newBooks),
        "EX",
        RedisKeys.newBooks.expTime
      );
    } else {
      console.log("New books data found in cache. Skipping scrape.");
    }
    if (!popularBooks) {
      console.log("Popular books data not in cache. Scraping popular books...");
      const { data: popularBookData } = await axios.get(popularBooksUrl);
      popularBooks = scrapeBooks(popularBookData);
      await redisClient.set(
        RedisKeys.popularBooks.key,
        JSON.stringify(popularBooks),
        "EX",
        RedisKeys.popularBooks.expTime
      );
    } else {
      console.log("Popular books data found in cache. Skipping scrape.");
    }
    if (!teensBook) {
      console.log("Teens books data not in cache. Scraping teens books...");
      const { data: teensBookData } = await axios.get(teensBooksUrl);
      teensBook = scrapeBooks(teensBookData);
      await redisClient.set(
        RedisKeys.teensBooks.key,
        JSON.stringify(teensBook),
        "EX",
        RedisKeys.teensBooks.expTime
      );
    } else {
      console.log("Teens books data found in cache. Skipping scrape.");
    }
    console.log("Scraping completed and data stored in Redis.");
  } catch (error) {
    console.error("Error scraping the webpage:", error);
    throw new Error("Failed to scrape data.");
  }
};

const scrapeBooks = (htmlData: string): Book[] => {
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
