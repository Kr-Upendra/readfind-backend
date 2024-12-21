import { Request, Response, NextFunction } from "express";
import { asyncHandler, CustomResponse } from "../utils";
import { scrapeSections } from "../services";

export const scrapeController = asyncHandler(
  async (req: Request, res: Response<CustomResponse>, next: NextFunction) => {
    await scrapeSections();
    res.json({
      status: "success",
      message: "Section Data retrieved successfully.",
    });
  }
);
