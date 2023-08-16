const express = require("express");

const {
  validateBody,
  validateId,
  validateFavorite,
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

router.get("/", getContactsController);

router.get("/:id", validateId, getByIdController);

router.post("/", validateBody(addContactShema), addContactController);

router.delete("/:id", validateId, removeByIdController);

router.put(
  "/:id",
  validateId,
  validateBody(addContactShema),
  updateByIdController
);

router.patch(
  "/:id/favorite",
  validateId,
  validateFavorite(updateFavoriteSchema),
  updateStatusContactController
);

module.exports = router;
