import { Request, Response, NextFunction } from "express";
import { asyncHandler, sectionSubUrl } from "../utils";
import { scrapeByCategory, scrapeBySection, scrapeDetail } from "../services";

export const scrapeBookSection = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const section: string = req.params.sectionName;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;

    const result = await scrapeBySection(section, sectionSubUrl[section], page);

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
