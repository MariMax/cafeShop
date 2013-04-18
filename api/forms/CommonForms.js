
var form = require("express-form"),
    filter = form.filter,
    validate = form.validate;

SupportForm = form(
    filter("email").trim(),
        validate("email").required(null, 'please enter email')
        .isEmail('need some email'),

    filter("UserName").trim(),
        validate("UserName")
        .required(null, 'please enter UserName'),

    filter("text").trim(),
        validate("text")
        .required(null, 'please enter text')

)



exports.SupportForm = SupportForm;

