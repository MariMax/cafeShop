var models = require('../models/Item.js');
var Item = models.Item;


exports.add_routes = function (app) {



    app.get("/api/item/:id", function (req, res) {
        Item.findOne({ _id: req.params.id }, function (err, item) {
            if (err)
                res.send(err, 404);
            else
                res.json(item, 200);
        });
    });

    app.put("/api/item/:id", function (req, res) {
        var data = req.body;
        Item.updateItem(req.params.id,data,function(err,item)
        {
            if (err)
                res.send(err, 404);
            else
                res.json(item, 200);
        });
    });

    app.post("/api/shop/:shopId/category/:categoryId/items", function (req, res) {
        
        console.log('body : ' + req.body);
        Item.newItem(req.params.shopId, req.params.categoryId, req.body, function (itemId) {
            res.send({ id: itemId }, 201)
        }, function (err) {
            console.log('ERROR : ' + err);
        })

    });

    app.get("/api/shop/:shopId/category/:categoryId/items", function (req, res) {
        Item.find({ _shop: req.params.shopId, _category: req.params.categoryId }, function (err, item) {
            if (err)
            {
                console.log('error : ' + err);
                res.send(err, 404);
            }
            else
                res.json(item, 200);
        });
    });

    app.delete("/api/item/:id", function (req, res) {
        console.log('delete Item');
        Item.remove({ _id: req.params.id }, function (err){
            if (err)
                res.send(err, 404);
        });
        res.json(req.params.id, 200);
    });
}

