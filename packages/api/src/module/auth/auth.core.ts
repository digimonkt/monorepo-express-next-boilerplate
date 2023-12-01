import { JwtAuthPayload } from "src/utils/jwtService/jwt.payload";

export class AuthRecord extends JwtAuthPayload {
  id: string;
  authId: string;

  constructor(init: AuthRecord) {
    super();
    Object.assign(this, init);
  }

  static newUser(authId: string, isEmailVerified: boolean) {
    return new AuthRecord({
      id: authId,
      authId,
      isVerified: false,
      isEmailVerified,
    });
  }

  static fullUser(authId: string, userId: string) {
    return new AuthRecord({
      id: userId,
      authId,
      isVerified: true,
    });
  }
}
