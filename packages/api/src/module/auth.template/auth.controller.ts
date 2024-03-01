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

  private readonly setAccessTokenToHeader = (
    res: Response,
    accessToken: string,
  ) => {
    res.setHeader("x-access", accessToken);
  };

  private readonly setRefreshTokenToHeader = (
    res: Response,
    accessToken: string,
  ) => {
    res.setHeader("x-refresh", accessToken);
  };

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
      this.setAccessTokenToHeader(res, accessToken);
      this.setRefreshTokenToHeader(res, refreshToken);
      res.sendCreated201Response("User created successfully", { user });
    } catch (error) {
      res.sendErrorResponse("Error creating user", error);
    }
  };

  public createSession = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await this.userService.findOneWithOptions({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error("Invalid password");
      }

      const { accessToken, refreshToken } =
        await this.authService.createSession({
          email,
          password,
          ip: req.ip ?? "",
          userAgent: req.headers["user-agent"] ?? "",
        });

      this.setAccessTokenToHeader(res, accessToken);
      this.setRefreshTokenToHeader(res, refreshToken);
      res.status(200).send({ message: "User logged in successfully", user });
    } catch (error) {
      res
        .status(401)
        .send({ message: "Email address or password is incorrect" });
    }
  };
}

export default AuthController;
