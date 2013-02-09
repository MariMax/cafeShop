var models = require('../models/Dish.js');
var Dish = models.Dish;

var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

exports.add_routes = function (app) {

    app.post("/dishes", function (req, res) {
        Dish.newDish(req.body, function (dishId) {
            res.send({ id: dishId }, 201)
        }, function (err) {
            console.log('ERROR : ' + err);
        })
    });

    app.get("/dishes/:id", function (req, res) {
        var result = Dish.findById(new ObjectId(req.params.id), function (err, obj) {
            if (err)
                res.send(err, 404);
            else
                res.json(obj, 200);
        });
    });
}

