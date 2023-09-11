const { User } = require("../db/models/usersModel");

const { HttpError, controllerWrapper, sendEmail } = require("../helpers");

const { registerSchema, loginSchema } = require("../schemas");

const bcrypt = require("bcrypt");

const { addUser } = require("../servises/usersServises");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET_KEY, BASE_URL } = process.env;

const fs = require("fs/promises");
const path = require("path");

const gravatar = require("gravatar");

const Jimp = require("jimp");

const crypto = require("node:crypto");

//registerController
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
  const verificationToken = crypto.randomUUID();
  const newUser = await addUser({
    ...req.body,
    password: hashPassword,
    avatarURL: avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">
              Click on the reference to confirm your email
          </a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

//verifyEmailController
const verifyEmailController = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({ message: "Verification successful" });
};

//resendVerifyEmailController
const resendVerifyEmailController = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).exec();
  if (!user) {
    throw HttpError(404, "Not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">
              Click on the reference to confirm your email
          </a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({ message: "Verification email sent" });
};

//loginController
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

  if (user.verify !== true) {
    // throw HttpError(401, "Email not verify");
    throw HttpError(404, "User not found");
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

//logoutController
const logoutController = async (req, res) => {
  const { id } = req.user;

  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (user.verify !== true) {
    // throw HttpError(401, "Email not verify");
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(id, { token: "" });

  res.status(204).end();
};

//getCurrentController
const getCurrentController = async (req, res) => {
  const { email, subscription } = req.user;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (user.verify !== true) {
    // throw HttpError(401, "Email not verify");
    throw HttpError(404, "User not found");
  }

  res.json({
    email,
    subscription,
  });
};

//updateSubscriptionController
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

  if (user.verify !== true) {
    // throw HttpError(401, "Email not verify");
    throw HttpError(404, "User not found");
  }

  // await user.save();

  res.json({
    email: user.email,
    subscription: user.subscription,
  });
};

//updateAvatarController
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
    .catch((error) => console.error(error));

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  registerController: controllerWrapper(registerController),
  verifyEmailController: controllerWrapper(verifyEmailController),
  resendVerifyEmailController: controllerWrapper(resendVerifyEmailController),
  loginController: controllerWrapper(loginController),
  logoutController: controllerWrapper(logoutController),
  getCurrentController: controllerWrapper(getCurrentController),
  updateSubscriptionController: controllerWrapper(updateSubscriptionController),
  updateAvatarController: controllerWrapper(updateAvatarController),
};
