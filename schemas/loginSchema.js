const Joi = require("joi");
const { emailRegexp } = require("../db/models/usersModel");

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.base": '"email" not string',
    "any.required": "missing required email field",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": '"password" not string',
    "any.required": "missing required password field",
  }),
});

module.exports = loginSchema;
