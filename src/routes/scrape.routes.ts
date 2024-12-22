import { scrapeBookSections, scrapeBookDetails } from "../controllers";
import express from "express";
const router = express.Router();

router.route("/book-sections").get(scrapeBookSections);
router.route("/book-detail/:bookId").get(scrapeBookDetails);

export { router as scrapeRouter };
