var models = require('../models/Dish.js');
var Dish = models.Dish;

var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

exports.add_routes = function (app) {



    app.get("/api/dishes/:id", function (req, res) {
        Dish.findOne({ _id: req.params.id }, function (err, dish) {
            if (err)
                res.send(err, 404);
            else
                res.json(dish, 200);
        });
    });

    app.put("/api/dishes/:id", function (req, res) {
        var data = req.body;
        Dish.updateDish(req.params.id,data,function(err,dish)
        {
            if (err)
                res.send(err, 404);
            else
                res.json(dish, 200);
        });
    });

    app.post("/api/cafe/:cafeId/category/:categoryId/dishes", function (req, res) {
        
        console.log('body : ' + req.body);
        Dish.newDish(req.params.cafeId, req.params.categoryId, req.body, function (dishId) {
            res.send({ id: dishId }, 201)
        }, function (err) {
            console.log('ERROR : ' + err);
        })

    });

    app.get("/api/cafe/:cafeId/category/:categoryId/dishes", function (req, res) {
        Dish.find({ _cafe: req.params.cafeId, _category: req.params.categoryId }, function (err, dish) {
            if (err)
            {
                console.log('error : ' + err);
                res.send(err, 404);
            }
            else
                res.json(dish, 200);
        });
    });

    app.delete("/api/dishes/:id", function (req, res) {
        console.log('delete Dish');
        Dish.remove({ _id: req.params.id }, function (err){
            if (err)
                res.send(err, 404);
        });
        res.json(req.params.id, 200);
    });
}

