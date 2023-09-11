const Joi = require("joi");

const emailSchema = Joi.object({
  email: Joi.string().required().messages({
    "string.base": '"email" not string',
    "any.required": "missing required field email",
  }),
});

module.exports = emailSchema;
