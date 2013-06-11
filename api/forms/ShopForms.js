
var form = require("express-form"),
    filter = form.filter,
    validate = form.validate;

var createShopForm = form(
    filter("Name").trim(),
    validate("Name")
        .required(null, "please enter ShopName"),


    filter("cellPhone").trim(),
    validate("cellPhone")
        .required(null, "please enter CellPhone"),

    filter("userId").trim(),
    validate("userId")
        .required(null, "You should login")
        
        );

var UpdateShopCellPhoneForm = form(
    filter("shopId").trim(),
    validate("shopId")
        .required(null, "please enter shopId"),


    filter("cellPhone").trim(),
    validate("cellPhone")
        .required(null, "please enter сellPhone")
        
        );

var ConfirmShopCellPhoneForm = form(
    filter("shopId").trim(),
    validate("shopId")
        .required(null, "please enter shopId"),


    filter("cellPhone").trim(),
    validate("cellPhone")
        .required(null, "please enter cellPhone")
        .regex(/^(\+7)[0-9]{10}$/,"wrong cellPhone"),
        
    filter("token").trim(),
    validate("token")
        .required(null, "please enter token")
        );

var updateShopForm = form(
    filter("Name").trim(),
    validate("Name")
        .required(null, "please enter ShopName"),

   filter("Address").trim(),
   filter("Description").trim(),
   filter("WorkTime").trim(),
   filter("shopId").trim(),
   validate("shopId")
        .required(null, "please enter shopId"),
   filter("ClientPhone").trim(),
   filter("Latitude").trim(),
   filter("Longitude").trim(),
   filter("Logo").trim(),
   filter("Delivery").trim(),
   filter("cellPhone").trim(),
   validate("cellPhone")
        .required(null, "please enter CellPhone")
);
        
exports.createShopForm = createShopForm;
exports.updateShopForm = updateShopForm;
exports.UpdateShopCellPhoneForm = UpdateShopCellPhoneForm;
exports.ConfirmShopCellPhoneForm = ConfirmShopCellPhoneForm;