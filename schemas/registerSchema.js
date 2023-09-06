const Joi = require("joi");
const { emailRegexp } = require("../db/models/usersModel");

const registerSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": '"name" not string',
    "any.required": "missing required email field",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.base": '"email" not string',
    "any.required": "missing required email field",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": '"password" not string',
    "any.required": "missing required password field",
  }),
  token: Joi.string(),
});

module.exports = registerSchema;
