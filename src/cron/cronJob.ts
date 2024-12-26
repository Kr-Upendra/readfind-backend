// src/cron/cronJob.ts
import cron from "node-cron";
import { scrapeSections } from "../services";

let lastRunDate: any = null;

cron.schedule("0 1 * * *", async () => {
  const currentDate: any = new Date();

  if (!lastRunDate || currentDate - lastRunDate >= 3 * 24 * 60 * 60 * 1000) {
    console.log("Running the scraping task every 3 days at 1 AM...");
    try {
      await scrapeSections();
      lastRunDate = currentDate;
    } catch (error) {
      console.error("Error running the scheduled scrape task:", error);
    }
  } else {
    console.log("Not running the task; it's not 3 days yet.");
  }
});

cron.schedule("* * * * *", () => {
  console.log("This runs every minute!");
});
