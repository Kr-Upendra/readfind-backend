import { Request, Response, NextFunction } from "express";
import {
  asyncHandler,
  CustomResponse,
  redisClient,
  RedisKeys,
  sectionSubUrl,
} from "../utils";
import { scrapeByCategory, scrapeBySection, scrapeDetail } from "../services";

export const getNewBooks = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const section = "new";
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const result = await scrapeBySection(section, sectionSubUrl[section], page);

    res.status(200).json({
      status: "success",
      message: "New books list.",
      data: result,
    });
  }
);

export const getLastMonthPopularBooks = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const section = "popular";
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const result = await scrapeBySection(section, sectionSubUrl[section], page);

    res.status(200).json({
      status: "success",
      message: "Popular books list.",
      data: result,
    });
  }
);

export const getPopularInTeenBooks = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const section = "teen";
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const result = await scrapeBySection(section, sectionSubUrl[section], page);

    res.status(200).json({
      status: "success",
      message: "Teens books list.",
      data: result,
    });
  }
);

export const getBookByCategory = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const category = req.params.categoryName;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const result = await scrapeByCategory(category, page);

    res.status(200).json({
      status: "success",
      message: "List of books.",
      data: result,
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
