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
            User.find({ _shop: req.params.shopId,_id:req.session.user,approveInCurrentShop:true }, function (err, user) {
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

}