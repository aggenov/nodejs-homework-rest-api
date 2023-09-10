const express = require("express");

const fs = require("fs/promises");
const path = require("path");

const { validateBody, authenticate, upload } = require("../../middlewares");
const {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
  emailSchema,
} = require("../../schemas");

const {
  registerController,
  loginController,
  logoutController,
  getCurrentController,
  updateSubscriptionController,
  updateAvatarController,
  verifyEmailController,
  resendVerifyEmailController,
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
  authenticate,
  validateBody(loginSchema),
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
  upload.single("avatar"),
  updateAvatarController
);

// verifyEmail
router.get("/verify/:verificationToken", verifyEmailController);

//resend verifyToken to email
router.post("/verify", validateBody(emailSchema), resendVerifyEmailController);

module.exports = router;
