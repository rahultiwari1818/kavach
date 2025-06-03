import app from "./app.js";
import db_config from "./config/db.config.js";
const PORT = Number(process.env.PORT);
app.listen(PORT, () => {
    db_config();
    console.log(`Backend is Running on port ${PORT}.!`);
});
//# sourceMappingURL=server.js.map