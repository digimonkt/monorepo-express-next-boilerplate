import { type Request, type Response } from "express";
import { UserService } from "../user.template/user.service";
import { AuthService } from "./auth.service"; // Import AuthService

class AuthController {
  private readonly userService: UserService;
  private readonly authService: AuthService; // Add AuthService

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService(); // Initialize AuthService
  }

  public createUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.create(req.body);
      const { accessToken, refreshToken } =
        await this.authService.createSession({
          email: req.body.email,
          password: req.body.password,
          ip: req.ip ?? "",
          userAgent: req.headers["user-agent"] ?? "",
        });
      res.setHeader("x-access", accessToken);
      res.setHeader("x-refresh", refreshToken);
      res.sendCreated201Response("User created successfully", { user });
    } catch (error) {
      res.sendErrorResponse("Error creating user", error);
    }
  };
}

export default AuthController;
