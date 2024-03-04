import express from "express";
import {
  createRefreshTokenValidator,
  createUserBodyValidator,
  createUserSessionValidator,
} from "./auth.schema";
import AuthController from "./auth.controller";
import JoiValidator from "../../utils/joiValidator";

const authRoute = express.Router();
const authController = new AuthController();
const joiValidator = new JoiValidator();
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

export default authRoute;
