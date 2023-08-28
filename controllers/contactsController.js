const { HttpError, controllerWrapper } = require("../helpers");

const { addContactShema, updateFavoriteSchema } = require("../schemas");

const {
  getContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../servises/contactsServises");

const getContactsController = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await getContacts(owner, { skip, limit });
  const total = contacts.length;

  if (total < limit) {
    return res.json({
      // owner: contacts[0].owner,
      total: total,
      contacts,
    });
  }

  res.json({
    // owner: result[0].owner,
    page: page,
    per_page: limit,
    total: total,
    contacts,
  });
};

const getByIdController = async (req, res) => {
  const { id } = req.params;
  const result = await getContactById(id);

  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const addContactController = async (req, res) => {
  const { error } = addContactShema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { _id: owner } = req.user;
  console.log("owner ", owner);
  const result = await addContact({ ...req.body, owner });
  res.status(201).json(result);
};

const removeByIdController = async (req, res) => {
  const { id } = req.params;
  const result = await removeContact(id);
  if (!result) {
    throw HttpError(404, "Not contact");
  } else {
    res.json({ message: "contact deleted" });
  }
};

const updateByIdController = async (req, res) => {
  const { error } = addContactShema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { id } = req.params;
  const body = req.body;
  const result = await updateContact(id, body);
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const updateStatusContactController = async (req, res) => {
  const { error } = updateFavoriteSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { id } = req.params;

  const result = await updateStatusContact(id, req.body);
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

module.exports = {
  getContactsController: controllerWrapper(getContactsController),
  getByIdController: controllerWrapper(getByIdController),
  addContactController: controllerWrapper(addContactController),
  removeByIdController: controllerWrapper(removeByIdController),
  updateByIdController: controllerWrapper(updateByIdController),
  updateStatusContactController: controllerWrapper(
    updateStatusContactController
  ),
};
