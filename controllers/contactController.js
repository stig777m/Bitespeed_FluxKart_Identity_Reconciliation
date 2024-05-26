const { Contact } = require('../models');
const contactService = require('../services/contactService');

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.identifyContact = async (req, res) => {
  const { email, phoneNumber } = req.body;
  try {
    const contact = await contactService.identifyContact(email, phoneNumber);
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json( { error: error.message});
  }
};
