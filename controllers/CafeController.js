var models = require('../models/Cafe.js');
var Dish = models.Dish;

var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

exports.add_routes = function (app) {
    app.post("/cafe", function (req, res) {
        Cafe.newCafe(req.body, function (cafeId) {
            res.send({ id: cafeId }, 201)
        }, function (err) {
            console.log('ERROR : ' + err);
        })
    });
};