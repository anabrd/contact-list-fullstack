const contacts = require('../model/contacts');
const logModel = require('../model/logs');
require('mongoose').Promise = global.Promise;

exports.newPost = async (req, res) =>
    {
        // add a new contact to db
        const newContact = new contacts(req.body);
        console.log("log id from new contact", req.logId)
        // Bulent's code
        await newContact.save((err, docs) => {
            if (err) {
                res.send(err.errors);
            } else {
                res.send({status: "success", message:"New contact added", data: docs});
                logModel.findByIdAndUpdate(req.logId, {postData: JSON.stringify(docs)}, {new:true}, (err, doc) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(doc)
                    }
                })
            }
        });
    }

exports.getAll = (req, res) => {
    // if you want the entrire collection you need to put in an empty query
    contacts.find({}, (err, docs) => 
        {
            if (err) {
                res.send(err);
            } else {
                console.log(docs);
                res.send(docs);
            }
        });
}

exports.deleteContact = (req, res) => {
    // you can also use find by id (only works with id and returns only the collection deleted)
    const id = req.params.id;
    const logId = req.logId;
    contacts.findByIdAndDelete(id, (err, doc) => {
    // contacts.deleteOne({_id: req.params.id}, (err, docs) => {
        if (err) {
            res.send({status: "failed", message: err});
        } else if (doc === null) {
            res.send({status: "failed", message: "There was no contact."})
        } else {
            // You have to use the callback function in this method, it doesn't work otherwise
            logModel.findByIdAndUpdate(logId, {preData: JSON.stringify(doc)}, {new: true}, (docErr, docLog) => {
                if (err) {
                    console.log(docErr);
                } else {
                    console.log(docLog);
                    
                }
            })
            res.send({
                status: "success", 
                message: `${doc.fullName} deleted.`,
                data: doc._id
            })
        }})
}

exports.updateContact = async (req,res) => {
    const contact = req.body
    console.log(contact, )
    console.log(req.logId, "in update")
    // You have to add a runValidators object because otherwise the validation won't happen
    contacts.findByIdAndUpdate(contact._id, contact, {upsert: true, runValidators: true}, (err,doc)=>{
        if (err) {
            console.log(err);
            res.send({status:'failed', message: err});
        } else {
            console.log(doc);
            logModel.findByIdAndUpdate(req.logId, {preData: JSON.stringify(doc), postData: JSON.stringify(contact)}, (err) => {})
            res.send(({status:'success', message: 'Contact updated successfully'}));
        }
    });

    // You can also update with save, if you want to update the object based on only some keys (then you don't update the whole object)
    /* const updatedContact = await contacts.findById(contact._id);

    Object.keys(contact).forEach(key => updatedContact[key] = contact[key]);

    updatedContact.save((err, doc) => {
        if (err) {
            console.log(err);
            res.send({status: "failed", message: err});
        } else { */
            // UPDATE ONLY PRE AND POST DATA
            // logModel.findByIdAndUpdate(logId, log, {upsert: true, new: true}, (err, docLog)=> {
            //     if (err) {
            //         console.log(err);
            //         res.send({status:'failed', message: err});
            //     } else {
            //         console.log(docLog);
            //         res.send(({status:'success', message: 'Contact updated successfully'}));
            //     }
            // });

            // console.log(doc);
            // res.send({status: "success", message: "Contact updated successfully!"})
    //     }
    // })
}

exports.addPicture = (req, res) => {
    const picture = req.body
    console.log(req.body, "picture file")
}