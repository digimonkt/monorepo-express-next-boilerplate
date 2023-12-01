import {
  type Request,
  type Application,
  type Response,
  type NextFunction,
} from "express";
import ResponseSenderMiddleware from "./responseSenderMiddleware";
import JwtService from "../utils/jwtService";

const setupGlobalCustomMiddleware = (app: Application) => {
  // response sender middleware
  app.use((_req, res: Response, next: NextFunction) => {
    const responseSenderMiddleware = new ResponseSenderMiddleware(res);
    res.sendSuccess200Response =
      responseSenderMiddleware.sendSuccess200Response.bind(
        responseSenderMiddleware,
      );
    res.sendCreated201Response =
      responseSenderMiddleware.sendCreated201Response.bind(
        responseSenderMiddleware,
      );
    res.sendNoContent204Response =
      responseSenderMiddleware.sendNoContent204Response.bind(
        responseSenderMiddleware,
      );
    res.sendNotFound404Response =
      responseSenderMiddleware.sendNotFound404Response.bind(
        responseSenderMiddleware,
      );
    res.sendForbidden403Response =
      responseSenderMiddleware.sendForbidden403Response.bind(
        responseSenderMiddleware,
      );
    res.sendUnauthorized401Response =
      responseSenderMiddleware.sendUnauthorized401Response.bind(
        responseSenderMiddleware,
      );
    res.sendBadRequest400Response =
      responseSenderMiddleware.sendBadRequest400Response.bind(
        responseSenderMiddleware,
      );
    res.sendErrorResponse = responseSenderMiddleware.sendErrorResponse.bind(
      responseSenderMiddleware,
    );
    res.sendCustomSuccessResponse =
      responseSenderMiddleware.sendCustomSuccessResponse.bind(
        responseSenderMiddleware,
      );
    res.sendCustomErrorResponse =
      responseSenderMiddleware.sendCustomErrorResponse.bind(
        responseSenderMiddleware,
      );
    next();
  });
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const jwtService = new JwtService();
    req.jwt = jwtService;
    next();
  });
};

export default setupGlobalCustomMiddleware;
