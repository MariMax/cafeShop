
var pagesHelper = require('./controllers/pages.js');
var usersHelper = require('./controllers/UserController.js')
var dishesHelper = require('./controllers/DishesController.js')
var cafeHelper = require('./controllers/CafeController.js')
var siteCafeHelper = require('./controllers/site/CafeController.js')

module.exports = function (app) {

    pagesHelper.add_routes(app);
    usersHelper.add_routes(app);
    dishesHelper.add_routes(app);
    cafeHelper.add_routes(app);
    siteCafeHelper.add_routes(app);
};