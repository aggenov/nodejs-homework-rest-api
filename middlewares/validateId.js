const { isValidObjectId } = require("mongoose");
// const { HttpError } = require("../helpers");

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(404).json({ message: `${id} is not valid id` });
    // res.status(404).json({ message: "Is not valid id" });
    // next(HttpError((404, "Is not valid id")));
    return;
  }
  next();
};

module.exports = validateId;
