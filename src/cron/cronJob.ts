// src/cron/cronJob.ts
import cron from "node-cron";
import { scrapeSections } from "../services";

cron.schedule("0 8 * * 1", async () => {
  console.log("Running the scraping task every Monday at 8 AM...");
  try {
    await scrapeSections();
  } catch (error) {
    console.error("Error running the scheduled scrape task:", error);
  }
});

cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
});
