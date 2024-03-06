import express from "express";
import {
  createRefreshTokenValidator,
  createUserBodyValidator,
  createUserSessionValidator,
} from "./auth.schema";
import AuthController from "./auth.controller";
import JoiValidator from "../../utils/joiValidator";
import AuthMiddleware from "../../middleware/authMiddleware";

const authRoute = express.Router();
const authController = new AuthController();
const joiValidator = new JoiValidator();

const authMiddleware = new AuthMiddleware();
authRoute.post(
  "/create-user",
  joiValidator.validate(createUserBodyValidator, "body"),
  authController.createUser,
);
authRoute.post(
  "/create-session",
  joiValidator.validate(createUserSessionValidator, "body"),
  authController.createSession,
);

authRoute.post(
  "/refresh-access-token",
  joiValidator.validate(createRefreshTokenValidator, "body"),
  authController.refreshAccessToken,
);

authRoute.put("/logout", authMiddleware.protect, authController.logout);

export default authRoute;
