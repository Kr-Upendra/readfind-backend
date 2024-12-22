import express from "express";
const router = express.Router();
import {
  getNewBooks,
  getLastMonthPopularBooks,
  getPopularInTeenBooks,
} from "../controllers";

router.route("/new-books").get(getNewBooks);
router.route("/popular-books").get(getLastMonthPopularBooks);
router.route("/teens-books").get(getPopularInTeenBooks);

export { router as bookRouter };
