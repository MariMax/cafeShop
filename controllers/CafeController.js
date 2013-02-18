var models = require('../models/Cafe.js');
var forms = require('../forms/CafeForms.js');
var Dish = models.Dish;

var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

function logError(error) {
    if (error) {
        console.log(error);
    }
}
function ShowError(response, error) {
    if (error) {
        logError(error);
        response.json({ message: error });
    }
}

exports.add_routes = function (app) {
    app.get("/cafe", function (req, res) {
        Cafe.newCafe(req.body, function (err, cafe) {
            if (err) ShowError(res, err);
            res.send({ id: cafe._id }, 201)
        })
    });

    app.post('/cafes/newCafe', forms.createCafeForm, function (req, res) {
        if (req.form.isValid) {
            var data = {};
            Cafe.newCafe(req.form, function (err, cafe) {
                if (err) ShowError(res, err);
                res.send({ id: cafe._id }, 201)
            });
        }
    })
}