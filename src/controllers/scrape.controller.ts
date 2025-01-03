import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils";
import { scrapeDetail, scrapeSections } from "../services";

export const scrapeBookSections = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    await scrapeSections();
    res.json({
      status: "success",
      message: "Section Data retrieved successfully.",
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
