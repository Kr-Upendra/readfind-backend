import { Request, Response, NextFunction } from "express";
import { asyncHandler, CustomResponse, redisClient, RedisKeys } from "../utils";

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
