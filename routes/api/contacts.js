const express = require("express");

const {
  validateBody,
  validateId,
  validateFavorite,
  authenticate,
} = require("../../middlewares");
const { addContactShema, updateFavoriteSchema } = require("../../schemas");

const {
  getContactsController,
  addContactController,
  getByIdController,
  removeByIdController,
  updateByIdController,
  updateStatusContactController,
} = require("../../controllers/contactsController");

const router = express.Router();

router.get("/", authenticate, getContactsController);

router.get("/:id", authenticate, validateId, getByIdController);

router.post(
  "/",
  authenticate,
  validateBody(addContactShema),
  addContactController
);

router.delete("/:id", authenticate, validateId, removeByIdController);

router.put(
  "/:id",
  authenticate,
  validateId,
  validateBody(addContactShema),
  updateByIdController
);

router.patch(
  "/:id/favorite",
  authenticate,
  validateId,
  validateFavorite(updateFavoriteSchema),
  updateStatusContactController
);

module.exports = router;
