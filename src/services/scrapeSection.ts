import axios from "axios";
import * as cheerio from "cheerio";
import { Book, redisClient, RedisKeys } from "../utils";

export const scrapeSections = async () => {
  const popularBooksUrl =
    "https://www.bookshare.org/discover/popular/MONTH?resultsView=LIST&";
  const newBooksUrl =
    "https://www.bookshare.org/discover/newOnBookshare?resultsView=LIST";

  try {
    const cachedNewBooks = await redisClient.get(RedisKeys.newBooks);
    const cachedPopularBooks = await redisClient.get(RedisKeys.popularBooks);

    if (cachedNewBooks && cachedPopularBooks) {
      console.log("Data found in cache. Skipping scrape.");
      return;
    }

    console.log("Cache miss. Scraping data...");
    const { data: newBookData } = await axios.get(newBooksUrl);
    const newBooks = scrapeBooks(newBookData);

    const { data: popularBookData } = await axios.get(popularBooksUrl);
    const popularBooks = scrapeBooks(popularBookData);

    await redisClient.set(RedisKeys.newBooks, JSON.stringify(newBooks));
    await redisClient.set(RedisKeys.popularBooks, JSON.stringify(popularBooks));
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
    const title = $(element).find("h2.bookTitle a").text().trim();
    const imageUrl =
      $(element).find("img.cover-image-search-list").attr("src") || "";
    const authorName = $(element).find("span.bookAuthor a").text().trim();

    const bookUrl = $(element).find("h2.bookTitle a").eq(1).attr("href") || "";
    const id =
      $(element).find("h2.bookTitle a").eq(0).attr("name")?.split("-")[1] || "";

    const image = imageUrl.includes("SMALL")
      ? imageUrl.replace("SMALL", "MEDIUM")
      : imageUrl;

    const author = authorName.includes("null")
      ? authorName.split("null ")[1]
      : authorName;

    books.push({ id, title, image, author, url: bookUrl });
  });

  return books;
};
