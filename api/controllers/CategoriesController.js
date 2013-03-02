var models = require('../models/Category.js');
var Category = models.Category;

var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

exports.add_routes = function (app) {
    app.get("/api/cafes/:cafeId/category", function (req, res) {
        var categories = [];
        var breakfastCategory = new Category();
        breakfastCategory.Name = "Завтраки";
        breakfastCategory.IdName = "zavtraki";
        breakfastCategory._cafe = new ObjectId("513241e65e134f3817000004");
        breakfastCategory.id = new ObjectId("512b936a21886d13fcb8bee9");

        categories.push(breakfastCategory);
        res.json(categories, 200);

        //Category.find({ _cafe: req.params.cafeId }, function (err, category) {
        //    if (err)
        //        res.send(err, 404);
        //    else
        //        res.json(category, 200);
        //});
    });
}