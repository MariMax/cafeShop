var crypto = require('crypto')

exports.hash =  function hash (msg, key) {
    return crypto.createHmac('sha256', key).update(msg).digest('hex');
};

exports.required = function required(val) { return val && val.length; }

exports.sendMail = function sendMail(mailTo, mailFrom, subject, body, fn) {

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: mailFrom, // sender address
        to: mailTo, // list of receivers
        subject: subject, // Subject line
        //text: "Hello world ✔", // plaintext body
        html: body // html body
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, fn); 

}