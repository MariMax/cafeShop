
var form = require("express-form"),
    filter = form.filter,
    validate = form.validate;

var createCafeForm = form(
    filter("Name").trim(),
    validate("Name")
        .required(null, "please enter CafeName"),


    filter("CellPhone").trim(),
    validate("CellPhone")
        .required(null, "please enter CellPhone")
        
        );

        
exports.createCafeForm = createCafeForm;