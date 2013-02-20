var models = require('../models/Menu.js');
var Menu = models.Menu;

var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

exports.add_routes = function (app) {

    app.get("/cafe/menu/:id", function (req, res) {
        Menu.findOne({ _id: req.params.id }, function (err, value) {
            if (err)
                res.send(err, 404);
            else
                res.json(value, 200);
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

    app.post("/cafe/:cafeId/menu", function (req, res) {
        Menu.newDish(req.params.cafeId, req.body, function (menuId) {
            res.send({ id: menuId }, 201)
        }, function (err) {
            console.log('ERROR : ' + err);
        })

    });

    app.get("/cafe/:cafeId/menu", function (req, res) {
        Menu.find({ _cafe: req.params.cafeId }, function (err, menu) {
            if (err)
                res.send(err, 404);
            else
                res.json(menu, 200);
        });
    });

    app.delete("/cafe/menu/:id", function (req, res) {
        Menu.remove({ _id: req.params.id }, function (err, numberOfDeleted) {
             if (err)
                res.send(err, 404);
            else
                res.json(data, 200);
        });
    });

     app.post("/cafe/:cafeId/menu/:menuId/dish", function (req, res) {
        Menu.newDish(req.params.cafeId, req.body, function (menuId) {
            res.send({ id: menuId }, 201)
        }, function (err) {
            console.log('ERROR : ' + err);
        })

    });
}

