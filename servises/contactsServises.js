const Contact = require("../db/models/contactsModel");

const getContacts = async (owner, { skip, limit }) => {
  const result = await Contact.find({ owner }, "name email phone favorite", {
    skip,
    limit,
  })
    .populate("owner", "name email")
    .exec();

  return result;
};
const getContactById = async (id) => {
  const result = await Contact.findById(id).exec();

  return result;
};

const addContact = async (data) => {
  const result = await Contact.create(data);
  return result;
};

const removeContact = async (id) => {
  const result = await Contact.findByIdAndRemove(id).exec();
  return result;
};

const updateContact = async (id, data) => {
  const result = await Contact.findByIdAndUpdate(id, data, {
    new: true,
  }).exec();
  return result;
};

const updateStatusContact = async (id, data) => {
  const result = await Contact.findByIdAndUpdate(id, data, {
    new: true,
  }).exec();
  return result;
};

module.exports = {
  getContacts,
  addContact,
  getContactById,
  removeContact,
  updateContact,
  updateStatusContact,
};
