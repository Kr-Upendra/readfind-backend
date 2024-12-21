import express from "express";
const router = express.Router();
import { getNewBooks, getPopularBooks } from "../controllers";

router.route("/new-books").get(getNewBooks);
router.route("/popular-books").get(getPopularBooks);

export { router as bookRouter };
