import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { globalErrorHandler } from "./controllers";
import { CustomResponse, ErrorHandler } from "./utils";
import { scrapeRouter } from "./routes";
import { bookRouter } from "./routes/book.route";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response<CustomResponse>) => {
  res.status(200).json({
    status: "success",
    message: "Base route..",
  });
});

app.use("/api/scrape", scrapeRouter);
app.use("/api/books", bookRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(
    new ErrorHandler(`Can't find ${req.originalUrl} on this server.`, 404)
  );
});

app.use(globalErrorHandler);

export default app;
