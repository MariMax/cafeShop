var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/cafeShop');

var cafeSchema = new Schema({
    _id: ObjectId,
    Name:String,
    Adderss:String,
    Descroption:String,
    Logo: Buffer,
    //DeliveryMethods:[{type:ObjectId,ref:'DeliveryMethod'}],
    Users:[{type:ObjectId,ref:'User'}],
    Dishes:[{type:ObjectId,ref:'Dish'}],
    Menus:[{type:ObjectId,ref:'Menu'}],
    Orders:[{type:ObjectId,ref:'Order'}]
});

module.exports = mongoose.model('Cafe', cafeSchema);