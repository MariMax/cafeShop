
var form = require("express-form"),
    filter = form.filter,
    validate = form.validate;

var createCafeForm = form(
    filter("name").trim(),
    validate("name")
        .required(null, "please enter email"));
        
exports.createCafeForm = createCafeForm;