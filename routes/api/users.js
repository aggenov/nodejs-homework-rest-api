const express = require("express");

const fs = require("fs/promises");
const path = require("path");

const { validateBody, authenticate, upload } = require("../../middlewares");
const {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} = require("../../schemas");

const {
  registerController,
  loginController,
  logoutController,
  getCurrentController,
  updateSubscriptionController,
  updateAvatarController,
} = require("../../controllers/usersController");

const router = express.Router();

// signup
router.post("/register", validateBody(registerSchema), registerController);

// login / signin /
router.post("/login", validateBody(loginSchema), loginController);

// current User
router.get("/current", authenticate, getCurrentController);

// logout
router.post(
  "/logout",
  validateBody(loginSchema),
  authenticate,
  logoutController
);

//update subscription
router.patch(
  "/",
  authenticate,
  validateBody(updateSubscriptionSchema),
  updateSubscriptionController
);

// update avatars
router.patch(
  "/avatars",
  authenticate,
  // validateBody(updateAvatarSchema),
  upload.single("avatar"),
  updateAvatarController
);

module.exports = router;
