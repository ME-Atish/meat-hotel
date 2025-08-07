import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URI!);

const testConnection = async () => {
  try {
    redis.on("error", (error) => {
      if (error) {
        redis.quit();
        throw error;
      }
    });

    redis.on("ready", () => {
      console.log("Redis ready for use");
    });

    const redisPing = await redis.ping();
    console.log("Redis ping response", redisPing);
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

testConnection();

export default redis;
