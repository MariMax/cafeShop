var mongoose = require('mongoose')
  , mongoTypes = require('mongoose-types')
    , required = require('./CommonFunctions').required
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var uristring = 'mongodb://localhost/cafeShop';

// Ensure safe writes
var mongoOptions = { db: { safe: true} };

// Connect
mongoose.connect(uristring, mongoOptions, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + uristring);
    }
});

var dishSchema = new Schema({
    _cafe: ObjectId, // { type: ObjectId, ref: 'Cafe' },
    Name: String,
    Description: String,
    Price: Number,
    _category: ObjectId,
    Days: [Number]
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

Dish = mongoose.model('Dish', dishSchema);
exports.Dish = Dish;
