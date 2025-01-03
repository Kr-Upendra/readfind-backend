import express from "express";
const router = express.Router();
import {
  getNewBooks,
  getLastMonthPopularBooks,
  getPopularInTeenBooks,
  getBookDetails,
  getBookByCategory,
} from "../controllers";

router.route("/new-books").get(getNewBooks);
router.route("/popular-books").get(getLastMonthPopularBooks);
router.route("/teens-books").get(getPopularInTeenBooks);
router.route("/category/:categoryName").get(getBookByCategory);
router.route("/details/:bookId").get(getBookDetails);

export { router as bookRouter };
