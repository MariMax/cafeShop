var models = require('../models/Stock.js');
var Stock = models.Stock;

var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

exports.add_routes = function (app) {

    app.get("/shop/stock/:id", function (req, res) {
        Stock.findOne({ _id: req.params.id }, function (err, value) {
            if (err)
                res.send(err, 404);
            else
                res.json(value, 200);
        });
    });

    //app.put("/shop/items/:id", function (req, res) {
    //    var data = req.body;
    //    var query = { _id: req.params.id };
    //    Item.findOne(query, function (err, item) {
    //        if (err)
    //            res.send(err, 404);
    //        else {
    //            item.Name = data.Name;
    //            Item.save(function (err) {
    //                if (err)
    //                    res.send(err, 404);
    //                else
    //                    res.json(item, 200);
    //            });
    //            res.json(item, 200);
    //        }
    //    });
    //});

    app.post("/shop/:shopId/stock", function (req, res) {
        Stock.newStock(req.params.shopId, req.body, function (err,stock) {
            if (err) res.send('ERROR : ' + err,500); else
            res.send({ id: Stock._id }, 201)
        });

    });

    app.get("/shop/:shopId/stock", function (req, res) {
        Stock.find({ _shop: req.params.shopId }, function (err, stock) {
            if (err)
                res.send(err, 404);
            else
                res.json(stock, 200);
        });
    });

    app.delete("/shop/stock/:id", function (req, res) {
        Stock.remove({ _id: req.params.id }, function (err, numberOfDeleted) {
             if (err)
                res.send(err, 404);
            else
                res.json(data, 200);
        });
    });
}

