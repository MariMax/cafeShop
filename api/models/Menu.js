var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

// Ensure safe writes
var mongoOptions = { db: { safe: true} };


// Connect
mongoose.connect(conf.mongoConnection, mongoOptions, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + conf.mongoConnection + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + conf.mongoConnection); 
    }
});

function required(val) { return val && val.length; }

var menuSchema = new Schema({
    _cafe:{type:ObjectId, ref:'Cafe'},
    Name:String,
    Description:String
    //DateFrom:{type:Date,validate:[required,'Дата действия меню обязательна'],'default':Date.now.getDate() },
    //DateTo:{type:Date,validate:[required,'Дата действия меню обязательна'],'default':Date.now.getDate() },
    //Dishes:[{type:ObjectId,ref:'Dish'}]
});


menuSchema.statics.newMenu = function (cafeId, data, cb) {
    var instance = new Menu();
    instance._cafe = cafeId;
    instance.Name = data.Name;
    instance.Description = data.Description;
    instance.save(function (error, data) {
        if (error) {
            cb(error);
        }
        else {
            cb(null,instance);
        }
        //mongoose.connection.close()
    });
};


Menu = mongoose.model('Menu', menuSchema);
exports.Menu = Menu;