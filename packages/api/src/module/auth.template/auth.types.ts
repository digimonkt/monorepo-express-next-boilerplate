import { type JwtPayload } from "jsonwebtoken";

export interface CreateSessionType {
  email: string;
  password: string;
  ip: string;
  userAgent: string;
}

export interface JwtRefreshTokenPayload {
  sessionId: string;
  userId: string;
}

export interface JwtAccessTokenPayload extends JwtRefreshTokenPayload {
  isVerifiedEmail: boolean;
  isLocked: boolean;
}

export interface JwtRefreshTokenClaims
  extends JwtRefreshTokenPayload,
    JwtPayload {}
export interface JwtAccessTokenClaims
  extends JwtAccessTokenPayload,
    JwtPayload {}
