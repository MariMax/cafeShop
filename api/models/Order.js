var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    , mongoTypes = require('mongoose-types');

mongoTypes.loadTypes(mongoose, 'email');

mongoose.connect('mongodb://localhost/cafeShop');

function required(val) { return val && val.length; }

var orderSchema = new Schema({
    _cafe:{type:ObjectId, ref:'Cafe'},
    _deliveryMethod:{type:ObjectId, ref:'DeliveryMethod'},
    UserName:String,
    UserPhone:String,
    Email:{
        type: mongoose.SchemaTypes.Email,
        validate: [required, 'Введите Email']
    },
    Dishes:[{type:ObjectId,ref:'Dish'}],
    Description:String,
    Price:Number,
    OrderDate:{type:Date, 'default' : Date.now()},
    Approved:{type:Boolean, 'default' : false}/*оплачен ли заказ*/,
    OrderGetTime:{type:Date,'default' : Date.now()}/*Дата когда заказ должен быть выполнен*/

});

Order = mongoose.model('Order', orderSchema);
exports.Order = Order;
