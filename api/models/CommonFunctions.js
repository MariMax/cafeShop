var crypto = require('crypto');
var rest = require('restler');

var shopModel = require('./Shop.js').Shop;


exports.hash =  function hash (msg, key) {
    return crypto.createHmac('sha256', key).update(msg).digest('hex');
};

exports.md5 = function md5 (msg) {
    return crypto.createHash('md5').update(msg).digest("hex");
};

exports.required = function required(val) { return val && val.length; }

exports.sendSMS = function (opt, phoneTo, messageText, callback) {
    switch (opt.service) {
        case 1:
            {
                var accountSid = opt.accountSid, 
                authToken = opt.authToken, 
                apiVersion = '2010-04-01', 
                uri = '/' + apiVersion + '/Accounts/' + accountSid + '/SMS/Messages', 
                host = 'api.twilio.com', 
                fullURL = 'https://' + accountSid + ':' + authToken + '@' + host + uri, 
                from = opt.From, 
                to = phoneTo, 
                body = messageText;

                rest.post(fullURL, {
                    data: { From: from, To: to, Body: body }
                }).addListener('complete', function (data, response) {
                    callback(data, response);
                });
            } break;
        case 2:
            {
                var to = phoneTo;
                while (to.charAt(0) === '+')
                    to = to.substr(1);

                var login = opt.login, 
                sender = opt.sender,
                password = opt.password,
                body = messageText,
                

                uri = '?login=' + login + '&psw=' + password + '&phones=' + to + '&sender=' + sender + '&mes=' + body+'&translit=1',
                host = 'smsc.ru/sys/send.php',
                fullURL = 'http://' + host + uri;

                rest.get(fullURL).addListener('complete', function (data, response) {
                    callback(data, response);
                });

            } break;
    }
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



exports.assignUserandShop = function (userId, shopId, callback) {
    shopModel.findOne({ _id: shopId }, function (error, shop) {
        if (error) { callback(error) }
        else {
            User.findOne({ _id: userId }, function (error, user) {
                if (error) { return callback(error) } else {
                    User.assignWithShop(shop._id, user._id, function (error, val) {
                        if (error) { callback(error) } else {
                            callback(null, val);
                        }
                    });
                }
            });
        }
    });
}

exports.approveuserInShop = function(userId,shopId, callback)
{
    User.findOne({ _id: userId }, function (error, requestedUser) {/*Ищем подтверждаемого юзера*/
        if (error) { callback(error) } else {
            console.log(requestedUser._shop);
            console.log(shopId);
            shopModel.findOne({ _id: shopId }, function (error, shop) { 
            if (error) callback("Shop does not exists"); else
            {
              if (requestedUser._shop.toString()== shop._id.toString()) {/*проверяем его принадлежность к кафе*/
                User.approveInShop(shop._id, requestedUser._id, function (error, result) {/*если все сошлось подтверждаем юзера*/
                    if (error) { callback(error) } else
                        callback(null, result)
                })
            } else {
                callback("confirm user from another shop");
            }  
            }
            })
            
        }
    })
}

log = function logError(error) {
    if (error) {
        console.log(error);
    }
}

exports.logError = log;

exports.ShowMessage = function(response, message, status) {
    if (message) {
        log(message);
        }
        response.json({ message: message, status: status},200);
    
}

exports.ru2en = {
  ru_str : "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя",
  en_str : ['A','B','V','G','D','E','JO','ZH','Z','I','J','K','L','M','N','O','P','R','S','T',
    'U','F','H','C','CH','SH','SHH',String.fromCharCode(35),'I',String.fromCharCode(39),'JE','JU',
    'JA','a','b','v','g','d','e','jo','zh','z','i','j','k','l','m','n','o','p','r','s','t','u','f',
    'h','c','ch','sh','shh',String.fromCharCode(35),'i',String.fromCharCode(39),'je','ju','ja'],

  translite : function(org_str) {
    var tmp_str = [];
    for(var i = 0, l = org_str.length; i < l; i++) {
      var s = org_str.charAt(i), n = this.ru_str.indexOf(s);
      if(n >= 0) { tmp_str[tmp_str.length] = this.en_str[n]; }
      else { tmp_str[tmp_str.length] = s; }
    }
    return tmp_str.join("");
  }

}
