var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/cafeShop');

var dishSchema = new Schema({
    _cafe: { type: ObjectId, ref: 'Cafe' },
    Name: String,
    Description: String,
    Price: Number,
    Logo: String
});


dishSchema.statics.newDish = function (data, cb, err) {
    var instance = new Dish();
    instance.Name = data.Data;
    instance.Description = data.Description;
    instance.Price = data.Price;
    instance.Logo = data.Logo;

    instance.save(function (error, data) {
        if (error) {
            err.json(error);
        }
        else {
            cb.json(data);
        }
    });


};

Dish = mongoose.model('Dish', dishSchema);
exports.Dish = Dish;
