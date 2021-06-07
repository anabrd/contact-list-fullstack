const contacts = require('../model/contacts')
const nodemailer = require("nodemailer")

exports.about = (req, res) => {

    contacts.find({}, (err, docs) => {
        if (err) {
            res.render('about', {testData: "There's a problem. Please try again."})
        } else {
            res.render('about', {testData: docs})
        }
    })
}

exports.contact = async (req, res) => {
    console.log(req.body);
    console.log("in contact");

    // This creates a fake test account on Ethereal
    //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        /* port: 587,
        secure: false,  */// true for 465, false for other ports
        auth: {
            user: 'anaforcs50x@gmail.com', // generated ethereal user
            pass: process.env.GMAIL, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Visitor" <visitor@example.com>', // sender address
        to: "ana.d.brdar@gmail.com", // list of receivers
        subject: "Ticket from " + req.body.fullName, // Subject line
        text: req.body.message, // plain text body
        html: `<b>${req.body.message}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}