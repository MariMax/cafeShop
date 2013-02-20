var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

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

var cafeSchema = new Schema({
    //_id: ObjectId,
    Name:String,
    Adderss:String,
    Descroption:String,
    Logo: Buffer,
    //DeliveryMethods:[{type:ObjectId,ref:'DeliveryMethod'}],
    //Users:[{type:ObjectId,ref:'User'}],
    Dishes:[{type:ObjectId,ref:'Dish'}],
    Menus:[{type:ObjectId,ref:'Menu'}],
    Orders:[{type:ObjectId,ref:'Order'}],
    CanWorkInCafeShop:Boolean
});

cafeSchema.statics.newCafe = function (data, cb) {
    console.log("newCafe");
    var instance = new Cafe();
    instance.Name = data.Name;
    instance.save(function (error, data) {
        if (error) {
            cb(error);
        }
        else {
            cb(null, instance);
        }
        //mongoose.connection.close()
    });


};

Cafe = mongoose.model('Cafe', cafeSchema);
module.exports = Cafe;