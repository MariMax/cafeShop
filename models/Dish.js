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
    _cafe: { type: ObjectId, ref: 'Cafe' },
    Name: String,
    Description: String,
    Price: Number,
    Logo: String
});


dishSchema.statics.newDish = function (data, cb, err) {
    var instance = new Dish();
    console.log(data);
    instance.Name = data.Name;
    instance.Description = data.Description;
    instance.Price = data.Price;
    instance.Logo = data.Logo;
    debugger;
    instance.save(function (error, data) {
        if (error) {
            err(error);
        }
        else {
            cb(data);
        }
    });


};

Dish = mongoose.model('Dish', dishSchema);
exports.Dish = Dish;
