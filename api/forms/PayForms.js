
var form = require("express-form"),
    filter = form.filter,
    validate = form.validate;

OrderFinalForm = form(
    filter("email").trim(),
        validate("email").required(null, 'please enter email')
        .isEmail('need some email'),

    filter("ordeId").trim(),
        validate("ordeId")
        .required(null, 'please enter ordeId'),

    filter("userName").trim(),
        validate("userName")
        .required(null, 'please enter UserName'),

    filter("cellPhone").trim(),
        validate("cellPhone")
        .required(null, "please enter CellPhone"),

    filter("description").trim(),
        validate("description")
        .required(null, 'please enter userId')
)



exports.OrderFinalForm = OrderFinalForm;
