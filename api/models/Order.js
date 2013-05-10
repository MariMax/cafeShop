var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    , commonFunctions = require('./CommonFunctions')
    , hash =commonFunctions.hash
    ,mongoTypes = require('mongoose-types');

mongoTypes.loadTypes(mongoose, 'email');

var itemSchema = new Schema({
    itemId:ObjectId,
    count:Number,
    price:Number
});

var orderSchema = new Schema({
    _shop: { type: ObjectId, ref: 'Shop' },
    //_deliveryMethod:{type:ObjectId, ref:'DeliveryMethod'},
    UserName: String,
    UserPhone: String,
    Email: {
        type: mongoose.SchemaTypes.Email

    },
    Items: [itemSchema],
    Description: String,
    Price: Number,
    OrderDate: { type: Date, 'default': Date.now() },
    Approved: { type: Boolean, 'default': false }, /*оплачен ли заказ*/
    PaymentId: { type: String },
    PaymentAmmount: Number,//сколько оплатили
    BalanceAmmount: Number,//сколько зачисленно
    myHash:String,
    paySystemHash:String,
    hash:String
    //OrderGetTime:{type:Date,'default' : Date.now()}/*Дата когда заказ должен быть выполнен*/

});



orderSchema.statics.createOrder = function (shopId, item, _quantify, _price, callback) {
    if (!_quantify) _quantify = 1;
    var instance = new Order();
    var itemOrder = new OrderItem({ itemId: item, count: _quantify, price: _price });
    var paymentId = '';
    paymentId = paymentId.randomString(12);
    instance.PaymentId = paymentId;
    instance._shop = shopId;
    instance.Items.push(itemOrder);
    instance.save(function (error, data) {
        if (error) {
            callback(error);
        }
        else {
            callback(null, instance);
        }
    })
}

orderSchema.statics.setOrderItems = function (orderId, item, _quantify,_price, callback) {
    if (!_quantify) _quantify = 1;
    Order.findOne({ _id: orderId, Approved: false }, function (error, order) {
        if (error) callback(error);
        else {
            var num = -1;
            for (var key in order.Items) {
                var val = order.Items[key];
                if (val.itemId == item) {
                    num = key;
                    order.Items[key].count = _quantify;
                    order.Items[key].price = _price;
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
                var itemOrder = new OrderItem({ itemId: item, count: _quantify,price:_price });
                order.Items.push(itemOrder);
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

orderSchema.statics.addOrderItems = function (orderId, item, _quantify, _price, callback) {
    if (!_quantify) _quantify = 1;
    Order.findOne({ _id: orderId, Approved: false }, function (error, order) {
        if (error) callback(error);
        else {
            var num = -1;
            for (var key in order.Items) {
                var val = order.Items[key];
                if (val.itemId == item) {
                    num = key;
                    var count = 0;
                    count += order.Items[key].count;
                    count += Number(_quantify);
                    order.Items[key].count = count;
                    order.Items[key].price = _price;
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
                var itemOrder = new OrderItem({ itemId: item, count: _quantify, price: _price });
                order.Items.push(itemOrder);
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
            for (var key in order.Items) {
                var val = order.Items[key];
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

orderSchema.statics.deleteOrderItem = function (orderId, item, callback) {

    Order.findOne({ _id: orderId, Approved:false }, function (error, order) {
        if (error) callback(error);
        else {
            var num = -1;
            for (var key in order.Items) {
                var val = order.Items[key];
                if (val.itemId == item) {
                    num = key;
                    order.Items[key].remove();
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

orderSchema.statics.setOrderInformation = function (orderId, data,price, callback) {
    console.log("UpdateOrderDescription");
    var newdata = {};
    if (data.description && data.description != '') newdata.Description = data.description;
    if (data.spUserEmail && data.spUserEmail != '') newdata.Email = data.spUserEmail;
    if (data.userName && data.userName != '') newdata.UserName = data.userName;
    if (data.cellPhone && data.cellPhone != '') newdata.UserPhone = data.cellPhone;
    if (price && price > 0) newdata.Price = price;
    newdata.hash = hash(price.toString(),conf.secret);

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

     orderSchema.statics.approveOrder = function (orderId, BalanceAmount,Amount,paySystemHash, hash, callback) {
         console.log("UpdateOrderDescription");
         var newdata = {};
         newdata.Approved = true;
         if (BalanceAmount && BalanceAmount > 0) newdata.BalanceAmmount = BalanceAmount;
         if (Amount && Amount > 0) newdata.PaymentAmmount = Amount;
         if (paySystemHash && paySystemHash !='') newdata.paySystemHash = paySystemHash;
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

OrderItem = mongoose.model('orderItem', itemSchema);
Order = mongoose.model('Order', orderSchema);
exports.Order = Order;

