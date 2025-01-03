import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils";
import {
  scrapeByCategory,
  scrapeBySection,
  scrapeDetail,
  scrapeSections,
} from "../services";

export const scrapeBookSections = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    await scrapeSections();
    res.json({
      status: "success",
      message: "Section Data retrieved successfully.",
    });
  }
);

export const scrapeBookSection = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { sectionName } = req.params;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    console.log({ section: sectionName, page });

    const result = await scrapeBySection(sectionName, page);

    res.json({
      status: "success",
      message: "Section Data retrieved successfully.",
      data: result,
    });
  }
);

export const scrapeBooksByCategory = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { categoryName } = req.params;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const result = await scrapeByCategory(categoryName, page);

    res.json({
      status: "success",
      message: "Section Data retrieved successfully.",
      data: result,
    });
  }
);

export const scrapeBookDetails = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { bookId } = req.params;

    await scrapeDetail(bookId);
    res.json({
      status: "success",
      message: `Book detail data retrieved successfully [${bookId}].`,
    });
  }
);
