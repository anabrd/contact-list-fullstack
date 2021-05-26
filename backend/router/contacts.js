const contacts = require('express').Router();
const contactsController = require('../controller/contacts');
const auth = require('../middleware/auth');
const logMid = require('../middleware/log');
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
contacts.get('/all', auth.checkAuth, logMid.logger, contactsController.getAll);
contacts.delete('/:id', auth.checkAuth, logMid.logger, contactsController.deleteContact);
contacts.post('/update', auth.checkAuth, logMid.logger, contactsController.updateContact);
contacts.post('/add', auth.checkAuth, logMid.logger, upload.single('contactPic'), contactsController.addContact);


module.exports = contacts;