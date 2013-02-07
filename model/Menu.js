/**
 * Created with JetBrains PhpStorm.
 * User: root
 * Date: 03.02.13
 * Time: 13:42
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/cafeShop');

function required(val) { return val && val.length; }

var menuSchema = new Schema({
    _cafe:{type:ObjectId, ref:'Cafe'},
    Name:String,
    Description:String,
    Logo:Buffer,
    DateFrom:{type:Date,validate:[required,'Дата действия меню обязательна'],default:Date.now.getDate() },
    DateTo:{type:Date,validate:[required,'Дата действия меню обязательна'],default:Date.now.getDate() },
    Dishes:[{type:ObjectId,ref:'Dish'}]
});

Menu = mongoose.model('Menu', menuSchema);
exports.Menu = Menu;