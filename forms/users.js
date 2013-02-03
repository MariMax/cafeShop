/**
 * Created with JetBrains PhpStorm.
 * User: root
 * Date: 03.02.13
 * Time: 18:18
 * To change this template use File | Settings | File Templates.
 */
var models = require("../model/User.js");

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