var mongoose = require('mongoose')
 , mongoTypes = require('mongoose-types')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var categorySchema = new Schema({
    Name: String,
    IdName: String,
    _shop: ObjectId,
    id: Number,
    ParentCategory: Number
});

categorySchema.statics.newCategory = function (shopId, id, idName, name, parentCategoryId, cb, err) {
    var instance = new Category();
    instance._shop = shopId;
    instance.Name = name;
    instance.IdName = idName;
    instance.id = id;
    instance.ParentCategory = parentCategoryId;
    instance.save(function (error, data) {
        if (error) {
            err(error);
        }
        else {
            cb(data);
        }
    });
};

categorySchema.statics.updateItem = function (itemId, data, cb) {
    var newdata = {};
    if (data.Name && data.Name != '') newdata.Name = data.Name;

    this.findByIdAndUpdate(itemId, { $set: newdata }, { multi: false, safe: true }, function (error, docs) {
        if (error) {
            cb(error, null);
        }
        else {
            cb(null, docs);
        }
    })
};

Category = mongoose.model('Category', categorySchema);
exports.Category = Category;