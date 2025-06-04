import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from 'cors';
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import { Request,Response } from "express";

import usersRoutes from "./routes/users.routes.js";

const app = express();

// implemented cors middleware 
app.use(cors({
  origin: String(process.env.FRONTEND_URL),
  credentials:true
}));



// implemented express.json middleware to convert all the request into json format
app.use(express.json());

app.use(express.urlencoded({extended:true}));

// implemented morgan for logging
app.use(morgan("dev"));


// Swagger UI Middleware

app.get("/swagger.json", (_req : Request, res : Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(undefined, {
  swaggerUrl: "/swagger.json", // ✅ Not a file path!
}));


// ------------------------------------ Routes --------------------------------------------------------------------------

// user route middleware
app.use("/api/v1/users",usersRoutes);









export default app;