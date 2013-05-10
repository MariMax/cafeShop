var mongoose = require('mongoose')
  , mongoTypes = require('mongoose-types')
    , required = require('./CommonFunctions').required
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

//var uristring = 'mongodb://localhost/shopShop';

//// Ensure safe writes
//var mongoOptions = { db: { safe: true} };

var itemSchema = new Schema({
    _shop: ObjectId, // { type: ObjectId, ref: 'Shop' },
    Name: String,
    Description: String,
    Price: Number,
    _category: ObjectId,
    Days: [],
    Image: String
});


itemSchema.statics.newItem = function (shopId, categoryId, data, cb, err) {
    var instance = new Item();
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

itemSchema.statics.updateItem = function (itemId, data, cb) {
    console.log("updateItem");
    var newdata = {};
    if (data.Name && data.Name != '') newdata.Name = data.Name;
    if (data.Description && data.Description != '') newdata.Description = data.Description;
    if (data.Description && data.Description != '') newdata.Description = data.Description;
    if (data.Price && data.Price > 0) newdata.Price = data.Price;
    if (data.Days) newdata.Days = data.Days;
    if (data.Image) newdata.Image = data.Image;

    this.findByIdAndUpdate(itemId, { $set: newdata }, { multi: false, safe: true }, function (error, docs) {
        if (error) {
            cb(error, null);
        }
        else {
            cb(null, docs);
        }
    })
};

itemSchema.statics.getItem = function (itemId, callback) {
    this.findOne({ _id: itemId }, callback);
}

itemSchema.statics.getItems = function (itemIds, callback) {
    this.find({ _id: { $in: itemIds} }, callback);
}

Item = mongoose.model('Item', itemSchema);
exports.Item = Item;
