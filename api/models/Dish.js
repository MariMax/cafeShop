var mongoose = require('mongoose')
  , mongoTypes = require('mongoose-types')
    , required = require('./CommonFunctions').required
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

//var uristring = 'mongodb://localhost/shopShop';

//// Ensure safe writes
//var mongoOptions = { db: { safe: true} };

var dishSchema = new Schema({
    _shop: ObjectId, // { type: ObjectId, ref: 'Shop' },
    Name: String,
    Description: String,
    Price: Number,
    _category: ObjectId,
    Days: [],
    Image: String
});


dishSchema.statics.newDish = function (shopId, categoryId, data, cb, err) {
    var instance = new Dish();
    instance._shop = shopId;
    instance._category = categoryId;
    instance.Name = data.Name;
    instance.Description = data.Description;
    instance.Price = data.Price;
    instance.Days = data.Days;
    instance.Image = data.Image;
    instance.save(function (error, data) {
        if (error) {
            err(error);
        }
        else {
            cb(data);
        }
    });
};

dishSchema.statics.updateDish = function (dishId, data, cb) {
    console.log("updateDish");
    var newdata = {};
    if (data.Name && data.Name != '') newdata.Name = data.Name;
    if (data.Description && data.Description != '') newdata.Description = data.Description;
    if (data.Description && data.Description != '') newdata.Description = data.Description;
    if (data.Price && data.Price > 0) newdata.Price = data.Price;
    if (data.Days) newdata.Days = data.Days;
    if (data.Image) newdata.Image = data.Image;

    this.findByIdAndUpdate(dishId, { $set: newdata }, { multi: false, safe: true }, function (error, docs) {
        if (error) {
            cb(error, null);
        }
        else {
            cb(null, docs);
        }
    })
};

dishSchema.statics.getDish = function (dishId, callback) {
    this.findOne({ _id: dishId }, callback);
}

dishSchema.statics.getDishes = function (dishIds, callback) {
    this.find({ _id: { $in: dishIds} }, callback);
}

Dish = mongoose.model('Dish', dishSchema);
exports.Dish = Dish;
