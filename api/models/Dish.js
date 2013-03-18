var mongoose = require('mongoose')
  , mongoTypes = require('mongoose-types')
    , required = require('./CommonFunctions').required
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

//var uristring = 'mongodb://localhost/cafeShop';

//// Ensure safe writes
//var mongoOptions = { db: { safe: true} };

//// Connect
//mongoose.connect(uristring, mongoOptions, function (err, res) {
//    if (err) {
//        console.log('ERROR connecting to: ' + uristring + '. ' + err);
//    } else {
//        console.log('Succeeded connected to: ' + uristring);
//    }
//});

var dishSchema = new Schema({
    _cafe: ObjectId, // { type: ObjectId, ref: 'Cafe' },
    Name: String,
    Description: String,
    Price: Number,
    _category: ObjectId,
    Days: []
});


dishSchema.statics.newDish = function (cafeId, categoryId, data, cb, err) {
    var instance = new Dish();
    instance._cafe = cafeId;
    instance._category = categoryId;
    instance.Name = data.Name;
    instance.Description = data.Description;
    instance.Price = data.Price;
    instance.Days = data.Days;
    instance.save(function (error, data) {
        if (error) {
            err(error);
        }
        else {
            cb(data);
        }
        mongoose.connection.close()
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

    this.findByIdAndUpdate(dishId, { $set: newdata }, { multi: false, safe: true }, function (error, docs) {
        if (error) {
            cb(error, null);
        }
        else {
            cb(null, docs);
        }
    })
};

Dish = mongoose.model('Dish', dishSchema);
exports.Dish = Dish;
