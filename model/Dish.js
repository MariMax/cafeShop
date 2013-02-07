/**
 * Created with JetBrains PhpStorm.
 * User: root
 * Date: 03.02.13
 * Time: 13:37
 * To change this template use File | Settings | File Templates.
 */

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
