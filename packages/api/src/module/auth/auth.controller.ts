import { type Request, type Response } from "express";
import { UserService } from "../user.template/user.service";

class AuthController {
  private readonly userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  public createUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.create(req.body);
      const accessToken = req.jwt.createAccessToken(
        {
          authId: "sessionId",
          id: "user._id",
          isVerified: true,
          isEmailVerified: true,
        },
        { sessionId: user._id },
      );
      const refreshToken = req.jwt.createRefreshToken({
        authId: "sessionId",
        id: "userId",
        isVerified: true,
        isEmailVerified: true,
      });
      res.sendCreated201Response("User created successfully", {
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.sendErrorResponse("Error creating user", error);
    }
  };
}

export default AuthController;
