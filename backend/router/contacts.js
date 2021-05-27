const contacts = require('express').Router();
const contactsController = require('../controller/contacts');
const auth = require('../middleware/auth');
const logMid = require('../middleware/log');
// Where is the right place to upload multer?

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/images')
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() +'_'+ file.originalname)
    }
});

const upload = multer({storage});


// contacts.post('/new', logMid.logger, contactsController.newPost);
contacts.get('/all', logMid.logger, contactsController.getAll);
contacts.delete('/:id', logMid.logger, contactsController.deleteContact);
contacts.post('/update', logMid.logger, contactsController.updateContact);
contacts.post('/add', logMid.logger, upload.single('contactPic'), contactsController.addContact);


module.exports = contacts;