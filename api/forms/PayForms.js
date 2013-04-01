
var form = require("express-form"),
    filter = form.filter,
    validate = form.validate;

OrderFinalForm = form(
    filter("email").trim(),
        validate("email").required(null, 'please enter email')
        .isEmail('need some email'),

    filter("orderId").trim(),
        validate("orderId")
        .required(null, 'please enter orderId'),

    filter("userName").trim(),
        validate("userName")
        .required(null, 'please enter userName'),

    filter("cellPhone").trim(),
        validate("cellPhone")
        .required(null, "please enter cellPhone"),

    filter("description").trim(),
        validate("description")
        .required(null, 'please enter description')
)



exports.OrderFinalForm = OrderFinalForm;
