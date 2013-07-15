var csv = require('csv');
var models = require('../models/Item.js');
var Item = models.Item;


exports.add_routes = function (app) {
    app.post("/api/shop/:shopId/import", function (req, res) {
        if (req.session.user) {
            User.find({ _shop: req.params.shopId, _id: req.session.user, approveInCurrentShop: true }, function (err, user) {
                if (err) res.send(err, 404);
                else {
                    csv().from(req.body).to(function (data) {

                    });
                }
            });
        } else res.send(404);
    });
}