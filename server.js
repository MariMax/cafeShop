var express = require('express')
  , app = express()
  , pages = require(__dirname + '/controllers/pages')
  , ejsLocals = require('ejs-locals');

 fs = require('fs');

var MongoStore = require('connect-mongo')(express),
    mongo = require('mongoose');

var path = require('path');
if (fs.existsSync('./configDefault.js')) {
    var configLocal = require('./configDefault.js');

/*    mail = require('mail').Mail(
        configLocal.getMailConfig());*/
    conf = configLocal.getSiteConfig();
}
else {
    console.log('Не удалось загрузить настройки');
}
  

app.use(express.cookieParser()) 
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