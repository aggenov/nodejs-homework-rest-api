const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const { HttpError } = require("../helpers");
const { User } = require("../db/models/usersModel");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;

  if (typeof authorization !== "string") {
    next(HttpError(401, "Not authorized"));
  }

  const [bearer, token] = authorization.split(" ", 2);

  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(id);

    if (!user || !token || user.token !== token) {
      next(HttpError(401, "Not authorized"));
    }

    // req.user = {
    //   id: user.id,
    //   name: user.name,
    // };
    req.user = user;

    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

module.exports = authenticate;
