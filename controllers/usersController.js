const { User } = require("../db/models/usersModel");

const { HttpError, controllerWrapper } = require("../helpers");

const { registerSchema, loginSchema } = require("../schemas");

const bcrypt = require("bcrypt");

const { addUser } = require("../servises/usersServises");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET_KEY } = process.env;

const fs = require("fs/promises");
const path = require("path");

const gravatar = require("gravatar");

const Jimp = require("jimp");

const registerController = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const newUser = await addUser({
    ...req.body,
    password: hashPassword,
    avatarURL: avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logoutController = async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: "" });

  res.status(204).end();
};

const getCurrentController = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const updateSubscriptionController = async (req, res) => {
  const { _id } = req.user;
  const newSubscription = req.body.subscription;

  const user = await User.findByIdAndUpdate(
    _id,
    { subscription: newSubscription },
    { new: true }
  );

  if (!user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  await user.save();

  res.json({
    email: user.email,
    subscription: user.subscription,
  });
};

const updateAvatarController = async (req, res) => {
  // adress  public/avatars  folder
  const avatarsDir = path.join(__dirname, "../", "public", "avatars");
  const { path: tempUpload, originalname } = req.file;

  const { _id } = req.user;
  const filename = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tempUpload, resultUpload);

  await Jimp.read(resultUpload)
    .then((image) => image.resize(250, 250).write(resultUpload))
    .catch((error) => console.log(error));

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  registerController: controllerWrapper(registerController),
  loginController: controllerWrapper(loginController),
  logoutController: controllerWrapper(logoutController),
  getCurrentController: controllerWrapper(getCurrentController),
  updateSubscriptionController: controllerWrapper(updateSubscriptionController),
  updateAvatarController: controllerWrapper(updateAvatarController),
};
