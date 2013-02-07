var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/cafeShop');

var dishSchema = new Schema({
    _cafe:{type:ObjectId, ref:'Cafe'},
    Name:String,
    Description:String,
    Price:Number,
    Logo:Buffer
});

Dish = mongoose.model('Dish', dishSchema);
exports.Dish = Dish;
