class JwtBasePayload {
  sub?: string;
  aud?: string;
  iss?: string;
}

export class JwtAuthPayload extends JwtBasePayload {
  isVerified: boolean;

  // Only set during auth for unverified users
  isEmailVerified?: boolean;

  // Only set for a blocked user
  isLocked?: boolean;
}

export type JwtRefreshPayload = JwtBasePayload;
