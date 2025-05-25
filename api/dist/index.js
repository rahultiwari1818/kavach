import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from 'cors';
import db_config from "./config/db.config.js";
const app = express();
const PORT = Number(process.env.PORT);
app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
    db_config();
    console.log(`Backend is Running on port ${PORT}.!`);
});
//# sourceMappingURL=index.js.map