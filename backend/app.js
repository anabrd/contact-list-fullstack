const express = require('express');
require('dotenv').config();
const contacts = require('./router/contacts');
const connectDB = require('./config/db');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const multer = require('multer');
const contactsModel = require('./model/contacts');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/images')
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() +'_'+ file.originalname)
    }
});

const upload = multer({storage});

connectDB();

app.use(express.json());

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    res.header('Access-Control-Allow-Methods', "GET, PUT, POST, DELETE");
    next();
}

app.use(allowCrossDomain);

app.use(express.static(path.join(__dirname, '/public')));

// Routes
app.use('/contacts', contacts);

app.listen(port, () => (console.log(`Server started to run on port ${port}.`)));

app.post('/contacts/add', upload.single('contactPic'), (req, res) => {
    console.log("request body", req.body, req.file)
    let newContact = new contactsModel({
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        contactPic: '/images/'+ req.file.filename
    })
    console.log("newContact", newContact)
    newContact.save((err, doc)=>{
        if (err) {
            res.send({status:"failed", message:"Something went wrong."})
        } else {
            res.send({status:"success", message:"New contact added.", data: doc})
        }
    })
}
)