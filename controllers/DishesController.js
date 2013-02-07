var models = require('../model/Dish.js');
var Dish = models.Dish;

exports.add_routes = function (app) {

     app.post("/dishes", function (req, res) {
         Dish.newDish(req.body,function()
         {
             
         })
    })
}

