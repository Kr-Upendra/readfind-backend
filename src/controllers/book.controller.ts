import { Request, Response, NextFunction } from "express";
import { asyncHandler, CustomResponse, redisClient, RedisKeys } from "../utils";
import { scrapeDetail } from "../services";

export const getNewBooks = asyncHandler(
  async (req: Request, res: Response<CustomResponse>, next: NextFunction) => {
    const result = await redisClient.get(RedisKeys.newBooks);
    let newBookData;
    if (result) newBookData = JSON.parse(result);

    res.json({
      status: "success",
      message: "New books list.",
      data: newBookData,
    });
  }
);

export const getLastMonthPopularBooks = asyncHandler(
  async (req: Request, res: Response<CustomResponse>, next: NextFunction) => {
    const result = await redisClient.get(RedisKeys.popularBooks);
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
  async (req: Request, res: Response<CustomResponse>, next: NextFunction) => {
    const result = await redisClient.get(RedisKeys.teensBooks);
    let popularBookData;
    if (result) popularBookData = JSON.parse(result);

    res.json({
      status: "success",
      message: "Popular books list.",
      data: popularBookData,
    });
  }
);

export const getBookDetails = asyncHandler(
  async (req: Request, res: Response<CustomResponse>, next: NextFunction) => {
    const { bookId } = req.params;
    const cachedResult = await redisClient.get(RedisKeys.bookId(bookId));
    let result = cachedResult ? JSON.parse(cachedResult) : null;

    if (!result) {
      console.log("scraping data");
      const result = await scrapeDetail(bookId);
      return res.status(200).json({
        status: "success",
        message: `Book detail data retrieved successfully [${bookId}].`,
        data: result,
      });
    } else {
      console.log("already there");
      return res.status(200).json({
        status: "success",
        message: `Book detail data retrieved successfully [${bookId}].`,
        data: result,
      });
    }
  }
);
