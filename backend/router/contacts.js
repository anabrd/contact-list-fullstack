const contacts = require('express').Router();
const contactsController = require('../controller/contacts');
const testMid = require('../middleware/test');
const logMid = require('../middleware/log')

contacts.post('/new', logMid.logger, contactsController.newPost);
contacts.get('/all', contactsController.getAll);
contacts.delete('/:id', logMid.logger, contactsController.deleteContact);
contacts.post('/update', logMid.logger, contactsController.updateContact);


module.exports = contacts;