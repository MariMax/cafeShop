var mongoose = require('mongoose')
 , mongoTypes = require('mongoose-types')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var categorySchema = new Schema({
    Name: String,
    IdName: String,
    _cafe: ObjectId,
    id: ObjectId
});

Category = mongoose.model('Category', categorySchema);
exports.Category = Category;