var models = require('../models/Dish.js');
var Dish = models.Dish;

var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

exports.add_routes = function (app) {

    app.get("/cafe/dishes/:id", function (req, res) {
        Dish.findOne({ _id: req.params.id }, function (err, dish) {
            if (err)
                res.send(err, 404);
            else
                res.json(dish, 200);
        });
    });

    app.put("/cafe/dishes/:id", function (req, res) {
        Dish.findOne({ _id: req.params.id }, function (err, dish) {
            if (err)
                res.send(err, 404);
            else {
                var data = req.body;
                Dish.Name = data.Name;
                Dish.Description = data.Description;
                Dish.Price = data.Price;
                Dish.Logo = data.Logo;
                Dish.save();
                res.json(dish, 200);
            }
        });
    });

    app.post("/cafe/:cafeId/dishes", function (req, res) {
        Dish.newDish(req.params.cafeId, req.body, function (dishId) {
            res.send({ id: dishId }, 201)
        }, function (err) {
            console.log('ERROR : ' + err);
        })

    });

    app.get("/cafe/:cafeId/dishes", function (req, res) {
        Dish.find({ _cafe: req.params.cafeId }, function (err, dish) {
            if (err)
                res.send(err, 404);
            else
                res.json(dish, 200);
        });
    });
}

