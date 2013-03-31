var express = require('express')
  , app = express()
  , ejsLocals = require('ejs-locals')
  , nodemailer = require("nodemailer")
  , upload = require('jquery-file-upload-middleware');

fs = require('fs');

var MongoStore = require('connect-mongo')(express),
    mongo = require('mongoose');

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

if (fs.existsSync('./configDefault.js')) {
    var configLocal = require('./configDefault.js');
    var mailSettings = configLocal.getMailConfig();


    smtpTransport = nodemailer.createTransport("SMTP", {
        host: mailSettings.host, // hostname
        secureConnection: true, // use SSL
        port: 465, // port for secure SMTP
        auth: {
            user: mailSettings.username,
            pass: mailSettings.password
        }
    });
    conf = configLocal.getSiteConfig();
    SMSconf = configLocal.getSMSConfig();
}
else {
    console.log('Не удалось загрузить настройки');
}

// configure upload middleware
upload.configure({
    tmpDir: __dirname + '/site/tmp',
    publicDir: __dirname + '/site/public',
    uploadDir: __dirname + '/site/public/uploads',
    uploadUrl: '/uploads',
    safeFileTypes: /\.(gif|jpe?g|png)$/i,
    imageTypes: /\.(gif|jpe?g|png)$/i,
    imageVersions: {
        'thumbnail': {
            width: 80,
            height: 80
        }
    }
});

app.use('/upload', upload.fileHandler());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({
    secret: conf.secret,
    store: new MongoStore(conf.db),
    maxAge: new Date(Date.now() + 3600000)
}));
// configuration settings 
app.set('views', __dirname + '/site/views')
app.engine('ejs', ejsLocals)
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/site/public'))

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

//app.get('/', function (req, res) { res.redirect('home') })

var routes = require('./routes.js');
routes(app);

app.listen(process.env.PORT);