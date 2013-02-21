var express = require('express')
  , app = express()
  , pages = require(__dirname + '/controllers/pages')
  , ejsLocals = require('ejs-locals')
  , nodemailer = require("nodemailer");

 path = require('path');

var MongoStore = require('connect-mongo')(express),
    mongo = require('mongoose');

//var path = require('path');

String.prototype.randomString = function (stringLength) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    if (!stringLength > 0) {
        var stringLength = 8;
    }
    var randomString = '';
    for (var i = 0; i < stringLength; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomString += chars.substring(rnum, rnum + 1);
    }
    return randomString;
}

String.prototype.randomNumberString = function (stringLength) {
    var chars = "0123456789";
    if (!stringLength > 0) {
        var stringLength = 8;
    }
    var randomString = '';
    for (var i = 0; i < stringLength; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomString += chars.substring(rnum, rnum + 1);
    }
    return randomString;
}

if (path.existsSync('./configDefault.js')) {
    var configLocal = require('./configDefault.js');
    var mailSettings = configLocal.getMailConfig();
    smtpTransport = nodemailer.createTransport("SMTP",{
            service: mailSettings.host,
            auth: {
                user:  mailSettings.username,
                pass: mailSettings.password
            }
        });
        

    conf = configLocal.getSiteConfig();
    SMSconf = configLocal.getSMSConfig();
}
else {
    console.log('Не удалось загрузить настройки');
}


app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({
    secret: conf.secret,
    store: new MongoStore(conf.db),
    maxAge: new Date(Date.now()+3600000)
  }));
// configuration settings 
app.set('views', __dirname + '/views')
app.engine('ejs',ejsLocals)
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

// mount routes
app.use(function (req, res, next) {
  app.locals.route = req.url
  next()
})

app.use(function (req, res, next) {
    if (req.session && req.session.user)
        app.locals.user = req.session.user;
    next();
});

app.get('/', function (req, res) { res.redirect('home') })

var routes = require('./routes.js');
routes(app);

app.listen(process.env.PORT);