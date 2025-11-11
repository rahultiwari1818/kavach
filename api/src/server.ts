import "dotenv/config.js";
import app from "./app.js";
import { connectToRedis } from "./config/redis.config.js";
import Database from "./config/db.config.js";
const PORT: number = Number(process.env.PORT);
import { appEventEmitter } from "./patterns/observers/eventEmitter.js";
import { auditLogger } from "./patterns/observers/auditLogger.js"; // import here

app.listen(PORT, () => {
  auditLogger;
  appEventEmitter;
  const db = Database.getInstance();
  db.connect();
  connectToRedis();
  console.log(`Backend is Running on port ${PORT}.!`);
});
