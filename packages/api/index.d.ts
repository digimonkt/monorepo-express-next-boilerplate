// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response } from "express";
import type JwtService from "./src/utils/jwtService";
declare global {
  namespace Express {
    interface Response {
      sendSuccess200Response: (message: string, data: any | null) => void;
      sendCreated201Response: (message: string, data: any | null) => void;
      sendNoContent204Response: () => void;
      sendNotFound404Response: (message: string, data: any | null) => void;
      sendForbidden403Response: (message: string, data: any | null) => void;
      sendUnauthorized401Response: (message: string, data: any | null) => void;
      sendBadRequest400Response: (message: string, data: any | null) => void;
      sendErrorResponse: (message: string, data: any | null) => void;
      sendCustomSuccessResponse: (message: string, data: any | null) => void;
      sendCustomErrorResponse: (message: string, data: any | null) => void;
    }
    interface Request {
      jwt: JwtService;
    }
  }
}
