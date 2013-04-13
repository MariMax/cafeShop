var express = require('express')
  , app = express()
  , ejsLocals = require('ejs-locals')
  , nodemailer = require("nodemailer")
, upload = require('jquery-file-upload-middleware'),
//, im = require('imagemagick')


fs = require('fs');
uploadsDir = __dirname + "\\site\\public\\uploads\\";
thumbnailDir = __dirname + "\\site\\public\\uploads\\thumbnail\\";

var MongoStore = require('connect-mongo')(express),
    mongoose = require('mongoose');



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
    //publicDir: __dirname + '/site/public',
    uploadDir: __dirname + '/site/public/uploads',
    uploadUrl: '/uploads',
    safeFileTypes: /\.(gif|jpe?g|png)$/i,
    imageTypes: /\.(gif|jpe?g|png)$/i,
    imageVersions: {
        thumbnail: {
            width: 200,
            height: 200
        }
    }
    ,
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE'
    }
});

// Connect
// Ensure safe writes
var mongoOptions = { db: { safe: true} };
mongoose.connect(conf.mongoConnection, mongoOptions, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + conf.mongoConnection + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + conf.mongoConnection);
    }
});


app.use('/upload', upload.fileHandler());
//upload.on('end', function (fileInfo) {
//    console.log('resized kittens.jpg to fit within 256x256px');
//    //var src1 = __dirname + '\\site\\public\\uploads\\' + fileInfo.name;
//    //var dst1 = __dirname + '\\site\\public\\uploads\\thumbnail\\' + fileInfo.name;
//    //console.log(src1);
//    //console.log(dst1);
//    //im.resize({
//    //    srcPath: src1,
//    //    dstPath: dst1,
//    //    width: 256
//    //}, function (err, stdout, stderr) {
//    //    if (err) throw err;
//    //    console.log('resized kittens.jpg to fit within 256x256px');
//    //});
//});
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