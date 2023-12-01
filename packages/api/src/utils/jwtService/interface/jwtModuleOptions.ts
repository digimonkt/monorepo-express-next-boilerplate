import type * as jwt from "jsonwebtoken";

export enum JwtSecretRequestType {
  SIGN,
  VERIFY,
}

export interface JwtModuleOptions {
  global?: boolean;
  signOptions?: jwt.SignOptions;
  secret?: string | Buffer;
  publicKey?: string | Buffer;
  privateKey?: jwt.Secret;
  /**
   * @deprecated
   */
  secretOrPrivateKey?: jwt.Secret;
  secretOrKeyProvider?: (
    requestType: JwtSecretRequestType,
    tokenOrPayload: string | object | Buffer,
    options?: jwt.VerifyOptions | jwt.SignOptions,
  ) => jwt.Secret | Promise<jwt.Secret>;
  verifyOptions?: jwt.VerifyOptions;
}

export interface JwtOptionsFactory {
  createJwtOptions: () => Promise<JwtModuleOptions> | JwtModuleOptions;
}

export interface JwtModuleAsyncOptions {
  global?: boolean;
  useExisting?: any; // Removed Type<JwtOptionsFactory>
  useClass?: any; // Removed Type<JwtOptionsFactory>
  useFactory?: (...args: any[]) => Promise<JwtModuleOptions> | JwtModuleOptions;
  inject?: any[];
  extraProviders?: any[]; // Removed Provider[]
}

export interface JwtSignOptions extends jwt.SignOptions {
  secret?: string | Buffer;
  privateKey?: jwt.Secret;
}

export interface JwtVerifyOptions extends jwt.VerifyOptions {
  secret?: string | Buffer;
  publicKey?: string | Buffer;
}

export type GetSecretKeyResult = string | Buffer | jwt.Secret;
