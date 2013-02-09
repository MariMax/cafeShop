
var pagesHelper = require('./controllers/pages.js');
var usersHelper = require('./controllers/UserController.js')
var dishesHelper = require('./controllers/DishesController.js')

module.exports = function (app) {

    pagesHelper.add_routes(app);
    usersHelper.add_routes(app);
    dishesHelper.add_routes(app);
};