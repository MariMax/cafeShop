/**
 * Created with JetBrains PhpStorm.
 * User: root
 * Date: 03.02.13
 * Time: 18:04
 * To change this template use File | Settings | File Templates.
 */
var express = require('express'),
    ejsLocals = require('ejs-locals'),
    fs = require('fs');

//var MongoStore = require('connect-mongo'),
var    mongo = require('mongoose');


MemoryStore = require('connect/lib/middleware/session/memory');
var session_store = new MemoryStore();




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


var app  = express();



/*app.set('view options', {
    layout: false
});
*/
// Configuration
app.use( function (req) {
    if (req.session)
        return req.session.user;
});
app.use(function(req){

    var msgs = req.session.messages;
    req.session.messages = [];
    return msgs
});
app.use(function(req) {

    var msgs = req.session.errors;
    req.session.errors = [];
    return msgs;
});
app.use(function (req, res, next) {

    app.locals.route = req.url
    next()
});

app.configure(function(){

    app.set('views', __dirname + '/views');
    app.engine('ejs', ejsLocals)
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: conf.secret,
        maxAge: new Date(Date.now() + 3600000),
        // store: new MongoStore(conf.db)
        store: session_store
    }));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

});

String.prototype.randomString = function(stringLength) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    if (!stringLength>0) {
        var stringLength = 8;
    }
    var randomString = '';
    for (var i=0; i<stringLength; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomString += chars.substring(rnum,rnum+1);
    }
    return randomString;
}

function requiresLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/?redir=' + req.url);
    }
};

loadGlobals = [requiresLogin];

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

require('./routes.js')(app);


if (!module.parent) {
    app.listen(3000);
    //console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}