import axios from "axios";
import * as cheerio from "cheerio";
import { Book } from "../utils";

export const scrapeSections = async (): Promise<any> => {
  const popularBooksUrl =
    "https://www.bookshare.org/discover/popular/MONTH?resultsView=LIST&";
  const newBooksUrl =
    "https://www.bookshare.org/discover/newOnBookshare?resultsView=LIST";

  try {
    const { data: newBookData } = await axios.get(newBooksUrl);
    const newBooks = scrapeBooks(newBookData);

    const { data: popularBookData } = await axios.get(popularBooksUrl);
    const popularBooks = scrapeBooks(popularBookData);

    return { newBooks, popularBooks };
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
    const image =
      $(element).find("img.cover-image-search-list").attr("src") || "";
    const authorName = $(element).find("span.bookAuthor a").text().trim();

    const bookUrl = $(element).find("h2.bookTitle a").eq(1).attr("href") || "";
    const id =
      $(element).find("h2.bookTitle a").eq(0).attr("name")?.split("-")[1] || "";

    const author = authorName.includes("null")
      ? authorName.split("null ")[1]
      : authorName;

    books.push({ id, title, image, author, url: bookUrl });
  });

  return books;
};
