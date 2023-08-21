const Joi = require("joi");

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "string.base": '"favorite" not string',
    "any.required": "missing field favorite",
  }),
});

module.exports = updateFavoriteSchema;
