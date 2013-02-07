var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/cafeShop');

var deliverySchema = new Schema({
    _cafe:{type:ObjectId, ref:'Cafe'},
    Name:String,
    Description:String,
    Price:Number,
    Orders:[{type:ObjectId,ref:'Order'}]
});

DeliveryMethod = mongoose.model('DeliveryMethod', deliverySchema);
exports.DeliveryMethod = DeliveryMethod;