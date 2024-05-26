const express = require('express');
const contactController = require('../controllers/contactController');

const router = express.Router();

//Made these APIs for further DB peeks
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContactById);

//asked API
router.post('/identify', contactController.identifyContact);


module.exports = router;
