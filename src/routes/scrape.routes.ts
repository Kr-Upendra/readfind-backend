import {
  scrapeBookDetails,
  scrapeBooksByCategory,
  scrapeBookSection,
} from "../controllers";
import express from "express";
const router = express.Router();

router.route("/book-section/:sectionName").get(scrapeBookSection);
router.route("/book-category/:categoryName").get(scrapeBooksByCategory);
router.route("/book-detail/:bookId").get(scrapeBookDetails);

export { router as scrapeRouter };
