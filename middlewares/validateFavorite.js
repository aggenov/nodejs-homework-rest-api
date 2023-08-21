const { HttpError } = require("../helpers");

const validateFavorite = (schema) => {
  const func = (req, res, next) => {
    const sizeBody = Object.keys(req.body).length;
    if (sizeBody === 0) {
      next(HttpError(400, "missing field favorite"));
    }

    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }

    next();
  };
  return func;
};

module.exports = validateFavorite;
