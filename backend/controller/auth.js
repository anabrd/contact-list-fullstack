const users = require('../model/users');

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
    console.log(req.body)
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
                res.send({status: "success", message:"User logged in successfully."})
            } else {
                res.send({status: "failed", message:"There was an error. Please try again later."})
            }
        }
    });
}