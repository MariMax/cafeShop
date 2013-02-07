
var pagesHelper = require('./controllers/pages.js');
var usersHelper = require('./controllers/UserController.js')

module.exports = function (app) {

    pagesHelper.add_routes(app);
    usersHelper.add_routes(app);

};