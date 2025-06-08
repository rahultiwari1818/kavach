import "dotenv/config.js";
import app from "./app.js";
import db_config from "./config/db.config.js";
import { connectToRedis } from "./config/redis.config.js";
const PORT = Number(process.env.PORT);
app.listen(PORT, () => {
    db_config();
    connectToRedis();
    console.log(`Backend is Running on port ${PORT}.!`);
});
//# sourceMappingURL=server.js.map