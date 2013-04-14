var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    ,mongoTypes = require('mongoose-types');

mongoTypes.loadTypes(mongoose, 'email');

var dishSchema = new Schema({
    dishId:ObjectId,
    count:Number,
    price:Number
});

var orderSchema = new Schema({
    _cafe: { type: ObjectId, ref: 'Cafe' },
    //_deliveryMethod:{type:ObjectId, ref:'DeliveryMethod'},
    UserName: String,
    UserPhone: String,
    Email: {
        type: mongoose.SchemaTypes.Email

    },
    Dishes: [dishSchema],
    Description: String,
    Price: Number,
    OrderDate: { type: Date, 'default': Date.now() },
    Approved: { type: Boolean, 'default': false }, /*оплачен ли заказ*/
    PaymentId: { type: String },
    PaymentAmmount: Number,//сколько оплатили
    BalanceAmmount: Number,//сколько зачисленно
    myHash:String,
    paySystemHash:String
    //OrderGetTime:{type:Date,'default' : Date.now()}/*Дата когда заказ должен быть выполнен*/

});



orderSchema.statics.createOrder = function (cafeId, dish, _quantify, _price, callback) {
    if (!_quantify) _quantify = 1;
    var instance = new Order();
    var dishOrder = new OrderDish({ dishId: dish, count: _quantify, price: _price });
    var paymentId = '';
    paymentId = paymentId.randomString(12);
    instance.PaymentId = paymentId;
    instance._cafe = cafeId;
    instance.Dishes.push(dishOrder);
    instance.save(function (error, data) {
        if (error) {
            callback(error);
        }
        else {
            callback(null, instance);
        }
    })
}

orderSchema.statics.setOrderDishes = function (orderId, dish, _quantify,_price, callback) {
    if (!_quantify) _quantify = 1;
    Order.findOne({ _id: orderId, Approved: false }, function (error, order) {
        if (error) callback(error);
        else {
            var num = -1;
            for (var key in order.Dishes) {
                var val = order.Dishes[key];
                if (val.dishId == dish) {
                    num = key;
                    order.Dishes[key].count = _quantify;
                    order.Dishes[key].price = _price;
                    order.save(function (error, data) {
                        if (error) {
                            callback(error);
                        }
                        else {
                            callback(null, order);
                        }
                    });
                    break;
                }
            }
            if (num == -1) {
                var dishOrder = new OrderDish({ dishId: dish, count: _quantify,price:_price });
                order.Dishes.push(dishOrder);
                order.save(function (error, data) {
                    if (error) {
                        callback(error);
                    }
                    else {
                        callback(null, data);
                    }
                });
            }
        }
    })
}

orderSchema.statics.addOrderDishes = function (orderId, dish, _quantify, _price, callback) {
    if (!_quantify) _quantify = 1;
    Order.findOne({ _id: orderId, Approved: false }, function (error, order) {
        if (error) callback(error);
        else {
            var num = -1;
            for (var key in order.Dishes) {
                var val = order.Dishes[key];
                if (val.dishId == dish) {
                    num = key;
                    var count = 0;
                    count += order.Dishes[key].count;
                    count += Number(_quantify);
                    order.Dishes[key].count = count;
                    order.Dishes[key].price = _price;
                    order.save(function (error, data) {
                        if (error) {
                            callback(error);
                        }
                        else {
                            callback(null, order);
                        }
                    });
                    break;
                }
            }
            if (num == -1) {
                var dishOrder = new OrderDish({ dishId: dish, count: _quantify, price: _price });
                order.Dishes.push(dishOrder);
                order.save(function (error, data) {
                    if (error) {
                        callback(error);
                    }
                    else {
                        callback(null, data);
                    }
                });
            }
        }
    })
}


orderSchema.statics.calcOrderPrice = function (orderId, callback) {

    Order.findOne({ _id: orderId, Approved: false }, function (error, order) {
        if (error) callback(error);
        else {
            var num = -1;
            var price = 0;
            for (var key in order.Dishes) {
                var val = order.Dishes[key];
                if (val.count!=null&&val.price!=null)
                price += val.count * val.price;
                console.log(price);
            }
            order.Price = price;
            order.save(function (error, data) {
                if (error) {
                    callback(error);
                }
                else {
                    callback(null, order);
                }
            });


        }
    })
}

orderSchema.statics.deleteOrderDish = function (orderId, dish, callback) {

    Order.findOne({ _id: orderId, Approved:false }, function (error, order) {
        if (error) callback(error);
        else {
            var num = -1;
            for (var key in order.Dishes) {
                var val = order.Dishes[key];
                if (val.dishId == dish) {
                    num = key;
                    order.Dishes[key].remove();
                    order.save(function (error, data) {
                        if (error) {
                            callback(error);
                        }
                        else {
                            callback(null, order);
                        }
                    });
                    break;
                }
            }
            if (num==-1) callback(null, order);

        }
    })
}

orderSchema.statics.setOrderInformation = function (orderId, data, callback) {
    console.log("UpdateOrderDescription");
    var newdata = {};
    if (data.description && data.description != '') newdata.Description = data.description;
    if (data.spUserEmail && data.spUserEmail != '') newdata.Email = data.spUserEmail;
    if (data.userName && data.userName != '') newdata.UserName = data.userName;
    if (data.cellPhone && data.cellPhone != '') newdata.UserPhone = data.cellPhone;
    if (data.price && data.price > 0) newdata.Price = data.price;


    this.findOne({ _id: orderId, Approved: false }, function (err, order) {
        if (err) callback(err); else
            Order.findByIdAndUpdate(orderId, { $set: newdata }, { multi: false, safe: true }, function (error, docs) {
                if (error) {
                    callback(error);
                }
                else {
                    Order.findOne({ _id: orderId }, callback)
                }
            })
    });


};

orderSchema.statics.getOrder = function (orderId, callback) {
    Order.findOne({_id:orderId},callback);
     }

     orderSchema.statics.dropOrder = function (orderId, callback) {
         Order.findOne({ _id: orderId, Approved: false }, function (error, order) {
             if (error) callback(error); else
                 Order.findByIdAndRemove(orderId, callback);
         });
     }

     orderSchema.statics.approveOrder = function (orderId, data, hash, callback) {
         console.log("UpdateOrderDescription");
         var newdata = {};
         newdata.Approved = true;
         if (data.spBalanceAmount && data.spBalanceAmount > 0) newdata.BalanceAmmount = data.spBalanceAmount;
         if (data.spAmount && data.spAmount > 0) newdata.PaymentAmmount = data.spAmount;
         if (data.spHashString && data.spHashString !='') newdata.paySystemHash = data.spHashString;
         if (hash&&hash!='') newdata.myHash = hash;

         this.findByIdAndUpdate(orderId, { $set: newdata }, { multi: false, safe: true }, function (error, docs) {
             if (error) {
                 callback(error);
             }
             else {
                 Order.findOne({ _id: orderId }, callback)
             }
         })


     };

OrderDish = mongoose.model('orderDish', dishSchema);
Order = mongoose.model('Order', orderSchema);
exports.Order = Order;

