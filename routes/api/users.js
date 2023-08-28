const express = require("express");

const { validateBody, authenticate } = require("../../middlewares");
const { registerSchema, loginSchema } = require("../../schemas");

const {
  registerController,
  loginController,
  logoutController,
  getCurrentController,
} = require("../../controllers/usersController");

const router = express.Router();

// signup
router.post("/register", validateBody(registerSchema), registerController);

// login / signin /
router.post("/login", validateBody(loginSchema), loginController);

// logout
router.post(
  "/logout",
  validateBody(loginSchema),
  authenticate,
  logoutController
);

// current User
router.get("/current", authenticate, getCurrentController);

module.exports = router;
