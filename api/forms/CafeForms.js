
var form = require("express-form"),
    filter = form.filter,
    validate = form.validate;

var createCafeForm = form(
    filter("Name").trim(),
    validate("Name")
        .required(null, "please enter CafeName"),


    filter("cellPhone").trim(),
    validate("cellPhone")
        .required(null, "please enter CellPhone"),

    filter("userId").trim(),
    validate("userId")
        .required(null, "You should login")
        
        );

var UpdateCafeCellPhoneForm = form(
    filter("cafeId").trim(),
    validate("cafeId")
        .required(null, "please enter cafeId"),


    filter("cellPhone").trim(),
    validate("cellPhone")
        .required(null, "please enter сellPhone")
        
        );

var ConfirmCafeCellPhoneForm = form(
    filter("cafeId").trim(),
    validate("cafeId")
        .required(null, "please enter cafeId"),


    filter("cellPhone").trim(),
    validate("cellPhone")
        .required(null, "please enter cellPhone")
        .regex(/^(\+7)[0-9]{10}$/,"wrong cellPhone"),
        
    filter("token").trim(),
    validate("token")
        .required(null, "please enter token")
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
   filter("cellPhone").trim(),
   validate("cellPhone")
        .required(null, "please enter CellPhone")
);
        
exports.createCafeForm = createCafeForm;
exports.updateCafeForm = updateCafeForm;
exports.UpdateCafeCellPhoneForm = UpdateCafeCellPhoneForm;
exports.ConfirmCafeCellPhoneForm = ConfirmCafeCellPhoneForm;