var mongoose = require('mongoose')
 , mongoTypes = require('mongoose-types')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var categorySchema = new Schema({
    Name: String,
    IdName: String,
    _shop: ObjectId,
    id: Number
});

categorySchema.statics.newCategory = function (shopId, id, idName, name, cb, err) {
    var instance = new Category();
    instance._shop = shopId;
    instance.Name = name;
    instance.IdName = idName;
    instance.id = id;
    instance.save(function (error, data) {
        if (error) {
            err(error);
        }
        else {
            cb(data);
        }
    });
};

Category = mongoose.model('Category', categorySchema);
exports.Category = Category;