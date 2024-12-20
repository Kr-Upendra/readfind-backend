import axios from "axios";
import cheerio from "cheerio";

export const scrapeSections = async (): Promise<any> => {
  const url = "https://www.bookshare.org/explore";

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    console.log($);

    const trending: { title: string; link: string }[] = [];
    // $("section.trending .item").each((index, element) => {
    //   const title = $(element).find(".title").text().trim();
    //   const link = $(element).find("a").attr("href") || "";
    //   trending.push({ title, link });
    // });

    const featured: { title: string; link: string }[] = [];
    // $("section.featured .item").each((index, element) => {
    //   const title = $(element).find(".title").text().trim();
    //   const link = $(element).find("a").attr("href") || "";
    //   featured.push({ title, link });
    // });

    return { trending, featured };
  } catch (error) {
    console.error("Error scraping the webpage:", error);
    throw new Error("Failed to scrape data.");
  }
};
