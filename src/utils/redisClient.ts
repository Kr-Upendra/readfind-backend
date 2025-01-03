import { Redis } from "ioredis";

const redisClient = new Redis();

const closeRedisConnection = () => {
  redisClient.quit();
  console.log("Redis client connection closed.");
};

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

export { redisClient, closeRedisConnection };
