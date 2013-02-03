/**
 * Created with JetBrains PhpStorm.
 * User: root
 * Date: 03.02.13
 * Time: 18:10
 * To change this template use File | Settings | File Templates.
 */


var UserHelper = require('./controllers/users.js');

module.exports = function(app){
    app.get('/home', function(req, res){
        res.render('Users/login', {title:"Start Page",message:"Hello"/*,
            redir: req.query.redir*/});
    });

    UserHelper.add_routes(app);
};