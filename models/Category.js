var mongoose = require('mongoose')
    , Schema = mongoose.Schema

var categorySchema = new Schema({
    Name: String,
    IdName: String
});

Category = mongoose.model('Category', categorySchema);
exports.Category = Category;