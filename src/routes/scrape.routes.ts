import { scrapeController } from "../controllers";
import express from "express";
const router = express.Router();

router.route("/sections").get(scrapeController);

export { router as scrapeRouter };
