import redis from "redis";

const client = redis.createClient();

client.on("error", (err) => {
  console.error(err);
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("ready", () => {
  console.log("Redis is ready to use");
});

export default client;
