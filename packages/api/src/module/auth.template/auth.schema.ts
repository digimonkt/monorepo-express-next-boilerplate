import Joi from "joi";

export const createUserBodyValidator = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});
export const createUserSessionValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const createRefreshTokenValidator = Joi.object({
  refreshToken: Joi.string().required(),
});
