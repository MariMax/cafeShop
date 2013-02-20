var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/cafeShop');

function required(val) { return val && val.length; }

var menuSchema = new Schema({
    _cafe:{type:ObjectId, ref:'Cafe'},
    Name:String,
    Description:String,
    //DateFrom:{type:Date,validate:[required,'Дата действия меню обязательна'],'default':Date.now.getDate() },
    //DateTo:{type:Date,validate:[required,'Дата действия меню обязательна'],'default':Date.now.getDate() },
    //Dishes:[{type:ObjectId,ref:'Dish'}]
});


menuSchema.statics.newMenu = function (cafeId, data, cb, err) {
    var instance = new Dish();
    instance._cafe = cafeId;
    instance.Name = data.Name;
    instance.Description = data.Description;
    instance.Price = data.Price;
    instance.save(function (error, data) {
        if (error) {
            err(error);
        }
        else {
            cb(data);
        }
        mongoose.connection.close()
    });
};


Menu = mongoose.model('Menu', menuSchema);
exports.Menu = Menu;