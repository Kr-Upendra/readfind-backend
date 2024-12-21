import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { closeRedisConnection } from "./utils";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  closeRedisConnection();
  process.exit(0);
});
