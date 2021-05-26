const users = require('../model/users');
const jwt = require('jsonwebtoken');
const jwtSKey = process.env.JWT_S_KEY;

exports.registerPost = (req, res) => {

    const newUser = new users(req.body);

    users.findOne({email: req.body.email}, (err, doc) => {
        if (err) {
            console.log(err);
            res.send({status: "failed", message:"Something went wrong."})
        // This is if the record already exists
        } else if (doc !== null) {
            res.status(406).send({status: "failed", message:"Email already in use."})
        } else {
            newUser.save((err, doc) => {
                if (err) {
                    res.send({status: "failed", message:"Something went wrong."})
                } else {
                    res.send({status: "success", message:"The account created successfully."})
                }
            })
        }
    });
}

exports.loginPost = (req, res) => {
    let {email, pass} = req.body;
    console.log("req body in controller", req.body)
    users.findOne({email, pass}, (err, doc) => {
        if (err) {
            console.log(err);
            res.send({status: "failed", message: err})
        // This is if the record already exists
        } else if (doc == null) {
            res.status(406).send({status: "failed", message:"Wrong credentials."})
        } else {
            console.log(doc)
            if (doc.pass == req.body.pass) {
                const token = jwt.sign({id:doc._id}, jwtSKey, {expiresIn: '1d'})
                res.send({status: "success", message:"User logged in successfully.", token})
            } else {
                res.send({status: "failed", message:"There was an error. Please try again later."})
            }
        }
    });
}