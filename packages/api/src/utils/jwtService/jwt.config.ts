import { JWT_AUTH_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from "./jwt.constant";

export const jwtAuthConfig = {
  useFactory: (expiresIn = JWT_AUTH_EXPIRES_IN) => {
    const authSecret = process.env.AUTH_SECRET;
    if (!authSecret) {
      throw new Error("'AUTH_SECRET' is not found in .env");
    }
    return {
      secret: authSecret,
      signOptions: {
        expiresIn,
      },
    };
  },
};
export const jwtRefreshConfig = {
  useFactory: (expiresIn = JWT_REFRESH_EXPIRES_IN) => {
    const authSecret = process.env.REFRESH_SECRET;
    if (!authSecret) {
      throw new Error("'REFRESH_SECRET' is not found in .env");
    }
    return {
      secret: authSecret,
      signOptions: {
        expiresIn,
      },
    };
  },
};
