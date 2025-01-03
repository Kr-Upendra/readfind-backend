import axios from "axios";
import { expTime, redisClient, scrapeBookList } from "../utils";
const baseWebsiteUrl = process.env.BASE_SCRAPE_WEBSITE_URL;

export const scrapeBySection = async (
  section: string,
  subUrl: string,
  page = 1
) => {
  const limit = 25;
  const offset = (page - 1) * limit;
  const url = `${baseWebsiteUrl}discover${subUrl}?offset=${offset}&resultsView=LIST`;
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
      return bookRecords;
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
      return bookRecords;
    }
  } catch (err) {
    console.error("Error scraping the webpage:", err);
    throw new Error("Failed to scrape data.");
  }
};
