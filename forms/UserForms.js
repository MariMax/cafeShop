
var models = require("../models/User.js");

var form = require("express-form"),
    filter = form.filter,
    validate = form.validate;

var LoginForm = form(
    filter("email").trim(),
    validate("email")
        .required(null, "Введите email")
        .isEmail("Необходим именно email"),

    filter("password").trim(),
    validate("password")
        .required(null, "Введите пароль")
);

var SignupForm = form(
    filter("email").trim(),
    validate("email")
        .required(null, "Введите email")
        .isEmail("Необходим именно email"),

    filter("password").trim(),
    validate("password")
        .required(null, "Введите пароль")
);

var ResetPasswdForm = form(
    filter("email").trim(),
    validate("email")
        .required(null, "Введите email")
        .isEmail("Необходим именно email")
);


exports.LoginForm = LoginForm;
exports.SignupForm = SignupForm;
exports.ResetPasswdForm = ResetPasswdForm;