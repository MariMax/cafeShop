var models = require('../models/Category.js');
var Category = models.Category;

var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

exports.add_routes = function (app) {
    app.get("/api/shops/:shopId/category", function (req, res) {
        console.log(req);
        Category.find({ _shop: req.params.shopId }, function (err, category) {
            if (err)
                res.send(err, 404);
            else
                res.json(category, 200);
        });
    });

    app.post("/api/category/delete/:id/shop/:shopId", function (req, res) {
        if (req.session.user) {
            User.find({ _shop: req.params.shopId, _id: req.session.user, approveInCurrentShop: true }, function (err, user) {
                if (err) res.send(err, 404);
                else {

                    Category.remove({ _id: req.params.id, _shop: req.params.shopId }, function (err) {
                        if (err)
                            res.send(err, 404);
                        else res.json(req.params.id, 200);
                    });
                }

            });
        } else res.send(404);
    });

    app.put("/api/shop/:shopId/category/:id", function (req, res) {
        if (req.session.user) {
            User.find({ _shop: req.params.shopId, _id: req.session.user, approveInCurrentShop: true }, function (err, user) {
                if (err) res.send(err, 404);
                else {

                    var data = req.body;
                    Category.updateItem(req.params.id, data, function (err, item) {
                        if (err)
                            res.send(err, 404);
                        else
                            res.json(item, 200);
                    });
                }
            })
        } else res.send(404);
    });

    app.post("/api/shop/:shopId/category/", function (req, res) {
        if (req.session.user) {
            var name = req.body.Name;
            var idname = req.body.IdName;
            Category.findOne({ _shop: req.params.shopId }).sort('-id').select('id').exec(function (error, id) {
                if (error)
                    res.send(err, 404);
                else {
                    var maxId = id.id;
                    Category.newCategory(req.params.shopId, (maxId + 1), name, idname, 0, function (itemId) {
                        res.send({ id: itemId }, 201)
                    }, function (err) {
                        console.log('ERROR : ' + err);
                    })
                }
            });
        } else res.send(404);
    });

    app.post("/api/shop/:shopId/category/:categoryId", function (req, res) {
        if (req.session.user) {
            var name = req.body.Name;
            var idname = req.body.IdName;
            var parentCategoryId = req.body.categoryId;
            var parentCategory = Category.findOne({ _id: parentCategoryId });
            if (parentCategory != null) {
                Category.findOne({ _shop: req.params.shopId }).sort('-id').select('id').exec(function (error, id) {
                    if (error)
                        res.send(err, 404);
                    else {
                        var maxId = id.id;
                        Category.newCategory(req.params.shopId, (maxId + 1), name, idname, parentCategoryId, function (itemId) {
                            res.send({ id: itemId }, 201)
                        }, function (err) {
                            console.log('ERROR : ' + err);
                        })
                    }
                });
            } else res.send(404);
        } else res.send(404);
    });


}