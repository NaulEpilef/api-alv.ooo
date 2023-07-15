import joi from "joi";

const signInSchema = joi.object({
  email: joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .min(7)
    .max(30)
    .required(),
  password: joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .min(6)
    .max(30)
    .required(),
});

const signUpSchema = joi.object({
  email: joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .min(7)
    .max(30)
    .required(),
  username: joi.string()
    .pattern(/^[a-zA-Z_]{2,30}$/)
    .min(2)
    .max(30)
    .required(),
  password: joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .min(6)
    .max(30)
    .required(),
  confirmPassword: joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .min(6)
    .max(30)
    .required(),
});

export { signInSchema, signUpSchema };