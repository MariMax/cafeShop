var models = require('../models/Category.js');
var Category = models.Category;

var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

exports.add_routes = function (app) {
    app.get("/api/cafe/:cafeId/category", function (req, res) {
        Category.find({ _cafe: req.params.cafeId }, function (err, category) {
            if (err)
                res.send(err, 404);
            else
                res.json(category, 200);
        });
    });
}