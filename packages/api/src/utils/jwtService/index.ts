import { type AuthRecord } from "../../module/auth/auth.core";
import { jwtAuthConfig, jwtRefreshConfig } from "./jwt.config";
import { JwtOriginalService } from "./jwt.service";
import { type JwtRefreshPayload, type JwtAuthPayload } from "./jwt.payload";

export interface JwtTokenExtraSettings {
  claims?: Partial<JwtAuthPayload>;
}
class JwtService {
  private readonly jwtAuthService: JwtOriginalService;
  private readonly jwtRefreshService: JwtOriginalService;

  constructor() {
    this.jwtAuthService = new JwtOriginalService(jwtAuthConfig.useFactory());
    this.jwtRefreshService = new JwtOriginalService(
      jwtRefreshConfig.useFactory(),
    );
  }

  createAccessToken(
    authRecord: AuthRecord,
    extraSettings: JwtTokenExtraSettings = {},
  ): string {
    const { claims } = extraSettings;
    const payload: JwtAuthPayload = {
      isVerified: !!authRecord.isVerified,
      isEmailVerified: authRecord.isEmailVerified,
      isLocked: authRecord.isLocked ? true : undefined,
      ...(claims ?? {}),
    };
    return this.jwtAuthService.sign(payload);
  }

  createRefreshToken(
    authRecord: AuthRecord,
    extraSettings: JwtTokenExtraSettings = {},
  ) {
    const { claims } = extraSettings;
    const payload: JwtRefreshPayload = {
      sub: authRecord.id,
      ...(claims ?? {}),
    };
    return this.jwtRefreshService.sign(payload);
  }
}

export default JwtService;
