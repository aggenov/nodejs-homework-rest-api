const { User } = require("../db/models/usersModel");
const { HttpError } = require("../helpers");

const addUser = async (data) => {
  const { email } = data;
  const user = await User.findOne({ email }).exec();
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const result = await User.create(data);
  return result;
};

module.exports = {
  addUser,
};
