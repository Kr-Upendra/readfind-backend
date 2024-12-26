import { Request, Response, NextFunction } from "express";
import { asyncHandler, CustomResponse, redisClient, RedisKeys } from "../utils";
import { scrapeDetail, scrapeSections } from "../services";

export const getNewBooks = asyncHandler(
  async (_req: Request, res: Response<CustomResponse>, _next: NextFunction) => {
    const result = await redisClient.get(RedisKeys.newBooks.key);

    if (!result) {
      console.log("Cache miss or expired, scraping data...");
      await scrapeSections();
      const result = await redisClient.get(RedisKeys.newBooks.key);
      let newBookData;
      if (result) newBookData = JSON.parse(result);

      return res.json({
        status: "success",
        message: "New books list.",
        data: newBookData,
      });
    }

    let newBookData;
    if (result) newBookData = JSON.parse(result);

    res.status(200).json({
      status: "success",
      message: "New books list.",
      data: newBookData,
    });
  }
);

export const getLastMonthPopularBooks = asyncHandler(
  async (_req: Request, res: Response<CustomResponse>, _next: NextFunction) => {
    const result = await redisClient.get(RedisKeys.popularBooks.key);

    if (!result) {
      console.log("Cache miss or expired, scraping data...");
      const newBookData = await scrapeSections();

      return res.json({
        status: "success",
        message: "Popular books list.",
        data: newBookData,
      });
    }

    let popularBookData;
    if (result) popularBookData = JSON.parse(result);

    res.json({
      status: "success",
      message: "Popular books list.",
      data: popularBookData,
    });
  }
);

export const getPopularInTeenBooks = asyncHandler(
  async (_req: Request, res: Response<CustomResponse>, _next: NextFunction) => {
    const result = await redisClient.get(RedisKeys.teensBooks.key);

    if (!result) {
      console.log("Cache miss or expired, scraping data...");
      const newBookData = await scrapeSections();

      return res.json({
        status: "success",
        message: "Teens books list.",
        data: newBookData,
      });
    }

    let popularBookData;
    if (result) popularBookData = JSON.parse(result);

    res.json({
      status: "success",
      message: "Teens books list.",
      data: popularBookData,
    });
  }
);

export const getBookDetails = asyncHandler(
  async (req: Request, res: Response<CustomResponse>, _next: NextFunction) => {
    const { bookId } = req.params;
    const { key } = RedisKeys.bookId(bookId);
    const cachedResult = await redisClient.get(key);
    let result = cachedResult ? JSON.parse(cachedResult) : null;

    if (!result) {
      console.log("scraping data");
      const result = await scrapeDetail(bookId);
      return res.status(200).json({
        status: "success",
        message: `Book detail data retrieved successfully.`,
        data: result,
      });
    } else {
      console.log("already there");
      return res.status(200).json({
        status: "success",
        message: `Book detail data retrieved successfully.`,
        data: result,
      });
    }
  }
);
