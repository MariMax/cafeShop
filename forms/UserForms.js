
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
        .required(null, "enter password").regex("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$","wrong password 1 degit, 1 uppercase, 1 lover case and min length 8")
);

var ResetPaswordForm = form(
filter("email").trim(),
validate("email").required(null,'please enter email')
.isEmail('need some email')
)


exports.SignupForm = SignupForm;
exports.ResetPasswordForm = ResetPaswordForm;
