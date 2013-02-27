var models = require('../models/Dish.js');
var Dish = models.Dish;

var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

exports.add_routes = function (app) {

    app.get("/cafe/:cafeId/category/:categoryId/dishes", function (req, res) 
    { res.render("dishes/list", { title: "dishes list", cafeId:req.params.cafeId, categoryId:req.params.categoryId  }); });

    app.get("/api/dishes/:id", function (req, res) {
        Dish.findOne({ _id: req.params.id }, function (err, dish) {
            if (err)
                res.send(err, 404);
            else
                res.json(dish, 200);
        });
    });

    //app.put("/cafe/dishes/:id", function (req, res) {
    //    var data = req.body;
    //    var query = { _id: req.params.id };
    //    Dish.findOne(query, function (err, dish) {
    //        if (err)
    //            res.send(err, 404);
    //        else {
    //            dish.Name = data.Name;
    //            Dish.save(function (err) {
    //                if (err)
    //                    res.send(err, 404);
    //                else
    //                    res.json(dish, 200);
    //            });
    //            res.json(dish, 200);
    //        }
    //    });
    //});

    app.post("/api/cafe/:cafeId/category/:categoryId/dishes", function (req, res) {
         console.log('body : ');
        console.log('body : ' + req.body);
        Dish.newDish(req.params.cafeId, req.params.categoryId, req.body, function (dishId) {
            res.send({ id: dishId }, 201)
        }, function (err) {
            console.log('ERROR : ' + err);
        })

    });

    app.get("/api/cafe/:cafeId/category/:categoryId/dishes", function (req, res) {
        Dish.find({ _cafe: req.params.cafeId }, function (err, dish) {
            if (err)
                res.send(err, 404);
            else
                res.json(dish, 200);
        });
    });

    app.delete("/dishes/:id", function (req, res) {
        Dish.remove({ _id: req.params.id }, function (err, numberOfDeleted) {
             if (err)
                res.send(err, 404);
            else
                res.json(data, 200);
        });
    });
}

