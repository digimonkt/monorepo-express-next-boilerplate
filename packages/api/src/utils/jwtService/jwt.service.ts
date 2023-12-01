import * as jwt from "jsonwebtoken";
import {
  type GetSecretKeyResult,
  type JwtModuleOptions,
  JwtSecretRequestType,
  type JwtSignOptions,
  type JwtVerifyOptions,
} from "./interface";
import { WrongSecretProviderError } from "./jwt.errors";
import logger from "../logger";

export class JwtOriginalService {
  constructor(private readonly options: JwtModuleOptions = {}) {}

  sign(
    payload: string,
    options?: Omit<JwtSignOptions, keyof jwt.SignOptions>,
  ): string;
  sign(payload: Buffer | object, options?: JwtSignOptions): string;
  sign(payload: string | Buffer | object, options?: JwtSignOptions): string {
    const signOptions = this.mergeJwtOptions(
      { ...options },
      "signOptions",
    ) as jwt.SignOptions;
    const secret = this.getSecretKey(
      payload,
      options ?? {},
      "privateKey",
      JwtSecretRequestType.SIGN,
    );

    if (secret instanceof Promise) {
      secret.catch(() => {}); // suppress rejection from async provider
      logger.warn(
        "For async version of 'secretOrKeyProvider', please use 'signAsync'.",
      );
      throw new WrongSecretProviderError();
    }

    const allowedSignOptKeys = ["secret", "privateKey"];
    const signOptKeys = Object.keys(signOptions);
    if (
      typeof payload === "string" &&
      signOptKeys.some((k) => !allowedSignOptKeys.includes(k))
    ) {
      throw new Error(
        "Payload as string is not allowed with the following sign options: " +
          signOptKeys.join(", "),
      );
    }

    return jwt.sign(payload, secret, signOptions);
  }

  signAsync(
    payload: string,
    options?: Omit<JwtSignOptions, keyof jwt.SignOptions>,
  ): Promise<string>;
  signAsync(
    payload: Buffer | object,
    options?: JwtSignOptions,
  ): Promise<string>;
  async signAsync(
    payload: string | Buffer | object,
    options?: JwtSignOptions,
  ): Promise<string> {
    const signOptions = this.mergeJwtOptions(
      { ...options },
      "signOptions",
    ) as jwt.SignOptions;
    const secret = await this.getSecretKey(
      payload,
      options ?? {},
      "privateKey",
      JwtSecretRequestType.SIGN,
    );

    const allowedSignOptKeys = ["secret", "privateKey"];
    const signOptKeys = Object.keys(signOptions);
    if (
      typeof payload === "string" &&
      signOptKeys.some((k) => !allowedSignOptKeys.includes(k))
    ) {
      throw new Error(
        "Payload as string is not allowed with the following sign options: " +
          signOptKeys.join(", "),
      );
    }

    return await new Promise<string>((resolve, reject) => {
      jwt.sign(payload, secret, signOptions, (err, encoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(encoded as string);
        }
      });
    });
  }

  verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T {
    const verifyOptions = this.mergeJwtOptions({ ...options }, "verifyOptions");
    const secret = this.getSecretKey(
      token,
      options ?? {},
      "publicKey",
      JwtSecretRequestType.VERIFY,
    );

    if (secret instanceof Promise) {
      secret.catch(() => {}); // suppress rejection from async provider
      logger.warn(
        "For async version of 'secretOrKeyProvider', please use 'verifyAsync'.",
      );
      throw new WrongSecretProviderError();
    }

    return jwt.verify(token, secret, verifyOptions) as T;
  }

  async verifyAsync<T extends object = any>(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<T> {
    const verifyOptions = this.mergeJwtOptions({ ...options }, "verifyOptions");
    const secret = await this.getSecretKey(
      token,
      options ?? {},
      "publicKey",
      JwtSecretRequestType.VERIFY,
    );

    return await new Promise<T>((resolve, reject) => {
      jwt.verify(token, secret, verifyOptions, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as T);
        }
      });
    });
  }

  decode<T = any>(token: string, options?: jwt.DecodeOptions): T {
    return jwt.decode(token, options) as T;
  }

  private mergeJwtOptions(
    options: JwtVerifyOptions | JwtSignOptions,
    key: "verifyOptions" | "signOptions",
  ): jwt.VerifyOptions | jwt.SignOptions {
    delete options.secret;
    if (key === "signOptions") {
      delete (options as JwtSignOptions).privateKey;
    } else {
      delete (options as JwtVerifyOptions).publicKey;
    }
    return options
      ? {
          ...(this.options[key] ?? {}),
          ...options,
        }
      : this.options[key] ?? {};
  }

  private overrideSecretFromOptions(secret?: GetSecretKeyResult) {
    if (secret === undefined || secret === null) {
      throw new Error("Secret is required");
    }
    if (this.options.secretOrPrivateKey) {
      logger.warn(
        "'secretOrPrivateKey' has been deprecated, please use the new explicit 'secret' or use 'secretOrKeyProvider' or 'privateKey'/'publicKey' exclusively.",
      );
      secret = this.options.secretOrPrivateKey;
    }

    return secret;
  }

  private getSecretKey(
    token: string | object | Buffer,
    options: JwtVerifyOptions | JwtSignOptions,
    key: "publicKey" | "privateKey",
    secretRequestType: JwtSecretRequestType,
  ): GetSecretKeyResult | Promise<GetSecretKeyResult> {
    const secret = this.options.secretOrKeyProvider
      ? this.options.secretOrKeyProvider(secretRequestType, token, options)
      : options?.secret ??
        this.options.secret ??
        (key === "privateKey"
          ? (options as JwtSignOptions)?.privateKey ?? this.options.privateKey
          : (options as JwtVerifyOptions)?.publicKey ??
            this.options.publicKey) ??
        this.options[key];

    return secret instanceof Promise
      ? secret.then((sec) => this.overrideSecretFromOptions(sec))
      : this.overrideSecretFromOptions(secret);
  }
}
