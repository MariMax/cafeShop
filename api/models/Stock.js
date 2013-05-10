var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;





function required(val) { return val && val.length; }

var stockSchema = new Schema({
    _shop:{type:ObjectId, ref:'Shop'},
    Name:String,
    Description:String
    //DateFrom:{type:Date,validate:[required,'Дата действия меню обязательна'],'default':Date.now.getDate() },
    //DateTo:{type:Date,validate:[required,'Дата действия меню обязательна'],'default':Date.now.getDate() },

});


stockSchema.statics.newStock = function (shopId, data, cb) {
    var instance = new Stock();
    instance._shop = shopId;
    instance.Name = data.Name;
    instance.Description = data.Description;
    instance.save(function (error, data) {
        if (error) {
            cb(error);
        }
        else {
            cb(null,instance);
        }

    });
};


Stock = mongoose.model('Stock', stockSchema);
exports.Stock = Stock;