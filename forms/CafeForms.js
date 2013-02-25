
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

var UpdateCafeCellPhoneForm = form(
    filter("cafeId").trim(),
    validate("cafeId")
        .required(null, "please enter cafeId"),


    filter("CellPhone").trim(),
    validate("CellPhone")
        .required(null, "please enter CellPhone")
        
        );

var updateCafeForm = form(
    filter("Name").trim(),
    validate("Name")
        .required(null, "please enter CafeName"),

   filter("Address").trim(),
   filter("Description").trim(),
   filter("WorkTime").trim(),
   filter("cafeId").trim(),
   validate("cafeId")
        .required(null, "please enter cafeId"),
   filter("ClientPhone").trim(),
   filter("Latitude").trim(),
   filter("Longitude").trim(),
   filter("Logo").trim(),
   filter("CellPhone").trim(),
   validate("CellPhone")
        .required(null, "please enter CellPhone")
);
        
exports.createCafeForm = createCafeForm;
exports.updateCafeForm = updateCafeForm;
exports.UpdateCafeCellPhoneForm = UpdateCafeCellPhoneForm;