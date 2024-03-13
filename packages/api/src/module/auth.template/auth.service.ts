import {
  type JwtAccessTokenPayload,
  type CreateSessionType,
  type JwtRefreshTokenPayload,
  type JwtRefreshTokenClaims,
  type JwtAccessTokenClaims,
} from "./auth.types";
import { UserSessionModel } from "../../models";
import JwtService from "../../utils/jwt";
import { UserService } from "../user.template/user.service";

export class AuthService {
  private readonly jwtService = new JwtService();
  private readonly userService = new UserService();

  public async createSession(payload: CreateSessionType) {
    const user = await this.userService.findOneWithOptions({
      email: payload.email,
    });

    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await user.comparePassword(payload.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    // create session
    const session = await UserSessionModel.create({
      userId: user._id,
      userAgent: payload.userAgent,
      ipAddress: payload.ip,
    });

    // create accessToken and refreshToken
    const accessTokenPayload: JwtAccessTokenPayload = {
      sessionId: session._id,
      userId: user._id,
      isVerifiedEmail: user.isVerifiedEmail,
      isLocked: user.isLocked,
    };

    const accessToken = this.createAccessToken(accessTokenPayload);

    const refreshTokenPayload: JwtRefreshTokenPayload = {
      sessionId: session._id,
      userId: user._id,
    };
    const refreshToken = this.createRefreshToken(refreshTokenPayload);
    return { accessToken, refreshToken };
  }

  private createAccessToken(payload: JwtAccessTokenPayload) {
    if (!process.env.JWT_ACCESS_TOKEN_TTL) {
      throw new Error("JWT_ACCESS_TOKEN_TTL is required");
    }
    return this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_TTL,
    });
  }

  private createRefreshToken(payload: JwtRefreshTokenPayload) {
    if (!process.env.JWT_REFRESH_TOKEN_TTL) {
      throw new Error("JWT_REFRESH_TOKEN_TTL is required");
    }
    return this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_TTL,
    });
  }

  public async getUserSessionDetailsBySessionId(sessionId: string) {
    const session = await UserSessionModel.findById(sessionId);
    return session;
  }

  public async getAccessTokenFromRefreshToken(refreshToken: string) {
    // Verify refreshToken
    const decoded = this.jwtService.verify(
      refreshToken,
    ) as JwtRefreshTokenClaims;
    if (!decoded) {
      return null;
    }
    const { sessionId } = decoded;
    const userSession = await this.getUserSessionDetailsBySessionId(sessionId);
    if (!userSession || !userSession.isValidSession) {
      return null;
    }
    // Generate accessToken
    const userDetails = await this.userService.findById(userSession.userId);
    if (userDetails) {
      const accessTokenPayload: JwtAccessTokenPayload = {
        sessionId: userSession._id,
        userId: userDetails._id,
        isVerifiedEmail: userDetails.isVerifiedEmail,
        isLocked: userDetails.isLocked,
      };
      const accessToken = this.createAccessToken(accessTokenPayload);
      return accessToken;
    }
    return null;
  }

  public async verifyAccessToken(
    token: string,
  ): Promise<JwtAccessTokenClaims | null> {
    try {
      const decoded = await this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  public async logoutSession(sessionId: string) {
    try {
      const session = await UserSessionModel.findById(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }
      // Update session details
      session.isValidSession = false;
      session.expiredAt = new Date();
      await session.save();
      return session;
    } catch (error) {
      throw new Error(`Error updating session: ${error.message}`);
    }
  }
}
