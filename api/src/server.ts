import "dotenv/config.js";
import app from "./app.js";
import { connectToRedis } from "./config/redis.config.js";
import Database from "./config/db.config.js";
const PORT: number = Number(process.env.PORT);

app.listen(PORT, () => {
  const db = Database.getInstance();
  db.connect();
  connectToRedis();
  console.log(`Backend is Running on port ${PORT}.!`);
});
