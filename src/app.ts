import express from "express";
import cors from "cors";
import morgan from "morgan";
// import scrapeRoutes from './routes/scrapeRoutes';

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Base route..",
  });
});

// Routes
// app.use('/api/scrape', scrapeRoutes);

export default app;
