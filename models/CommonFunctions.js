var crypto = require('crypto')
var rest = require('restler');
var models = require('../models/User.js');
var cafeModel = require('../models/Cafe.js');


var User = models.User;


exports.hash =  function hash (msg, key) {
    return crypto.createHmac('sha256', key).update(msg).digest('hex');
};

exports.required = function required(val) { return val && val.length; }

exports.sendSMS = function(opt, phoneTo, messageText, callback) {
    var accountSid = opt.accountSid,
        authToken = opt.authToken,
        apiVersion = '2010-04-01',
        uri = '/'+apiVersion+'/Accounts/'+accountSid+'/SMS/Messages',
        host = 'api.twilio.com',
        fullURL = 'https://'+accountSid+':'+authToken+'@'+host+uri,
        from = opt.From,
        to = phoneTo,
        body = messageText;

    rest.post(fullURL, {
        data: { From:from, To:to, Body:body }
    }).addListener('complete', function(data, response) {
        callback(data,response);
    });
}

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



exports.assignUserandCafe = function(userId,cafeId, callback)
{
    User.findOne({ _id: userId }, function (error, user) {
        if (error) { callback(error) }
        else {
            cafeModel.findOne({ _id: cafeId }, function (error, cafe) {
                if (error) { return callback(error) } else {
                    User
                    User.assignWithCafe(cafe._id, user._id, function (error, val) {
                        if (error) { callback(error) } else {
                            callback(null, val);
                        }
                    })
                }
            });
        }
    });
}

exports.approveuserInCafe = function(userId,cafeId, callback)
{
    User.findOne({ _id: userId }, function (error, requestedUser) {/*Ищем подтверждаемого юзера*/
        if (error) { callback(error) } else {
            console.log(requestedUser._cafe);
            console.log(cafeId);
            cafeModel.findOne({ _id: cafeId }, function (error, cafe) { 
            if (error) callback("Cafe does not exists"); else
            {
              if (requestedUser._cafe.toString()== cafe._id.toString()) {/*проверяем его принадлежность к кафе*/
                User.approveInCafe(cafe._id, requestedUser._id, function (error, result) {/*если все сошлось подтверждаем юзера*/
                    if (error) { callback(error) } else
                        callback(null, result)
                })
            } else {
                callback("confirm user from another cafe");
            }  
            }
            })
            
        }
    })
}

exports.logError = function(error) {
    if (error) {
        console.log(error);
    }
}
exports.ShowError = function(response, error) {
    if (error) {
        logError(error);
        }
        response.json({ message: error });
    
}