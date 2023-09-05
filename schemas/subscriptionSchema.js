const Joi = require("joi");

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .required()
    .valid("starter", "pro", "business")
    .messages({
      "string.base": '"subscription" not string',
      "any.required": "missing field subscription",
    }),
});

module.exports = updateSubscriptionSchema;
