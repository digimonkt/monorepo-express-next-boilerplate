import express from "express";
import dotenv from "dotenv";
import { Database } from "./utils/dbConnection";
import router from "./router";
import path from "path";
import emailService from "./utils/emailService";
import fileUpload from "express-fileupload";
import logger from "./utils/logger";
import setupGlobalCustomMiddleware from "./middleware";
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const PORT = process.env.PORT ?? 4000;

// database connection
const db = new Database(
  process.env.mongoURI ?? "mongodb://0.0.0.0:27017/social-media",
);
db.connect();

// email service
void emailService.init();
void emailService.verifyConnection();

const app = express();
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "./public")));

// Setup custom middleware
setupGlobalCustomMiddleware(app);

// Middleware to parse form data with express-fileupload
app.use(fileUpload());

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Expose-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access, x-refresh",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  );
  next();
});

app.get("/", (_req, res) => {
  res.sendSuccess200Response("Yay!🚀", null);
});

// routes
router.forEach((route) => {
  app.use(`/api/v1${route.prefix}`, route.router);
});

app.listen(PORT, () => {
  logger.info(`Server is running 🚀🚀🚀🚀 http://localhost:${PORT}`);
});
