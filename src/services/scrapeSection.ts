import axios from "axios";
import { expTime, redisClient, RedisKeys, scrapeBookList } from "../utils";
const baseWebsiteUrl = process.env.BASE_SCRAPE_WEBSITE_URL;

export const scrapeSections = async () => {
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

export const scrapeBySection = async (section: string, page = 1) => {
  const limit = 25;
  const offset = (page - 1) * limit;
  const url = `${baseWebsiteUrl}discover/popular/MONTH?offset=${offset}&resultsView=LIST`;
  const key = `books:section:${section}:page:${page}`;

  try {
    const cachedBookRecords = await redisClient.get(key);
    let bookRecords = cachedBookRecords ? JSON.parse(cachedBookRecords) : null;
    if (!bookRecords) {
      console.log(`Scraping section[${section}] book records...`);
      const { data: rawData } = await axios.get(url);
      bookRecords = scrapeBookList(rawData);
      await redisClient.set(key, JSON.stringify(bookRecords), "EX", expTime);
      console.log(`Section[${section}] Book record scraped successfully.`);
      return bookRecords;
    } else {
      console.log(
        `Section[${section}] book record found in cache. Skipping scrape.`
      );
    }
  } catch (err) {
    console.error("Error scraping the webpage:", err);
    throw new Error("Failed to scrape data.");
  }
};

export const scrapeByCategory = async (category: string, page = 1) => {
  const limit = 25;
  const offset = (page - 1) * limit;
  const bookUrl = `${baseWebsiteUrl}browse/category?sortOrder=ISBN&language=ENGLISH&limit=${limit}&offset=${offset}&resultsView=LIST&key=Animals`;
  const key = `books:category:${category}:page:${page}`;

  try {
    const cachedBookRecords = await redisClient.get(key);
    let bookRecords = cachedBookRecords ? JSON.parse(cachedBookRecords) : null;

    if (!bookRecords) {
      console.log(`Scraping category[${category}] book records...`);
      const { data: rawData } = await axios.get(bookUrl);
      bookRecords = scrapeBookList(rawData);
      await redisClient.set(key, JSON.stringify(bookRecords), "EX", expTime);
      console.log(`Category[${category}] Book record scraped successfully.`);
      return bookRecords;
    } else {
      console.log(
        `Category[${category}] book record found in cache. Skipping scrape.`
      );
    }
  } catch (err) {
    console.error("Error scraping the webpage:", err);
    throw new Error("Failed to scrape data.");
  }
};
