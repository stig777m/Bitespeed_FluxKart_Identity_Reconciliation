const express = require('express');
const contactController = require('../controllers/contactController');

const router = express.Router();

router.get('/', contactController.getAllContacts);
router.post('/', contactController.createContact);
router.get('/:id', contactController.getContactById);
router.post('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

router.post('/identify', contactController.identifyContact);


module.exports = router;
