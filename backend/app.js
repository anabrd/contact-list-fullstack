const express = require('express');
require('dotenv').config();
const contacts = require('./router/contacts');
const connectDB = require('./config/db');
const app = express();
const port = process.env.PORT || 8080;
const auth = require('./router/auth');

connectDB();

app.use(express.json());

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    res.header('Access-Control-Allow-Methods', "GET, PUT, POST, DELETE");
    next();
}

app.use(allowCrossDomain);

app.use(express.static(__dirname + '/public'));

app.listen(port, () => (console.log(`Server started to run on port ${port}.`)));

// Routes
app.use('/auth', auth);
app.use('/contacts', contacts)