
var usersHelper = require('./api/controllers/UserController.js')
var siteUsersHelper = require('./site/controllers/SiteUserController.js')
var dishesHelper = require('./api/controllers/DishesController.js')
var cafeHelper = require('./api/controllers/CafeController.js')
var orderHelper = require('./api/controllers/OrderController.js')
var commonHelper = require('./api/controllers/CommonController.js')

var categoriesHelper = require('./api/controllers/CategoriesController.js')
var siteCafeHelper = require('./site/controllers/SiteCafeController.js')
var siteOrderHelper = require('./site/controllers/SiteOrderController.js')
var siteCommonHelper = require('./site/controllers/SiteCommonController.js')

module.exports = function (app) {
    commonHelper.add_routes(app);
    siteCommonHelper.add_routes(app);
    usersHelper.add_routes(app);
    siteUsersHelper.add_routes(app);
    dishesHelper.add_routes(app);
    cafeHelper.add_routes(app);
    siteCafeHelper.add_routes(app);
    categoriesHelper.add_routes(app);
    orderHelper.add_routes(app);
    siteOrderHelper.add_routes(app);
};