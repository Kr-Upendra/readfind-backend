import { Redis } from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASSWORD,
  username: "default",
});

const closeRedisConnection = () => {
  redisClient.quit();
  console.log("Redis client connection closed.");
};

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

export { redisClient, closeRedisConnection };
