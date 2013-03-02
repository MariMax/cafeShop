
var usersHelper = require('./api/controllers/UserController.js')
var siteUsersHelper = require('./site/controllers/SiteUserController.js')
var dishesHelper = require('./api/controllers/DishesController.js')
var cafeHelper = require('./api/controllers/CafeController.js')
var siteCafeHelper = require('./site/controllers/CafeController.js')

module.exports = function (app) {

    usersHelper.add_routes(app);
    siteUsersHelper.add_routes(app);
    dishesHelper.add_routes(app);
    cafeHelper.add_routes(app);
    siteCafeHelper.add_routes(app);
};