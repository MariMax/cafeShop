
var models = require("../models/User.js");

var form = require("express-form"),
    filter = form.filter,
    validate = form.validate;

var SignupForm = form(
    filter("email").trim(),
    validate("email")
        .required(null, "please enter email")
        .isEmail("need some email"),

    filter("password").trim(),
    validate("password")
        .required(null, "enter password")
);

var ResetPaswordForm = form(
filter("email").trim(),
validate("email").required(null,'please enter email')
.isEmail('need some email')
)


exports.SignupForm = SignupForm;
exports.ResetPasswordForm = ResetPaswordForm;
