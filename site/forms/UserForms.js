
var models = require("../../api/models/User.js");

var form = require("express-form"),
    filter = form.filter,
    validate = form.validate;

var SignupForm = form(
    filter("email").trim(),
    validate("email")
        .required(null, "please enter email")
        .isEmail("need some email"),

    filter("UserName").trim(),
    validate("UserName")
        .required(null, "please enter NickName it can be FIO"),
        

    filter("password").trim(),
    validate("password")
        .required(null, "enter password").regex("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$","wrong password 1 degit, 1 uppercase, 1 lover case and min length 8"),

    filter("passwordConfirm").trim(),
    validate("passwordConfirm")
        .required(null, "enter valid passwordConfirm").regex("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$","wrong password 1 degit, 1 uppercase, 1 lover case and min length 8")

);

var LoginForm = form(
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

var AssignWithCafeForm = form(
filter("userId").trim(),
validate("userId").required(null,'please enter userId'),

filter("cafeId").trim(),
validate("cafeId").required(null,'please enter cafeId')
)

var UpdateNameForm = form(
filter("UserName").trim(),
validate("UserName").required(null,'please enter UserName')
)

var UpdateEmailForm = form(
filter("email").trim(),
validate("email").required(null,'please enter email')
.isEmail('need some email')
)

var UpdatePasswordForm = form(
    filter("OldPassword").trim(),
    validate("OldPassword")
        .required(null, "enter OldPassword"),

   filter("NewPassword").trim(),
    validate("NewPassword")
        .required(null, "enter NewPassword").regex("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$","wrong password 1 degit, 1 uppercase, 1 lover case and min length 8"),
   
   filter("PasswordConfirmation").trim(),
    validate("PasswordConfirmation")
        .required(null, "enter PasswordConfirmation").regex("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$","wrong password 1 degit, 1 uppercase, 1 lover case and min length 8")
)

var ResetPasswordForm2 = form(
    filter("userId").trim(),
    validate("userId")
        .required(null, "enter userId"),

   filter("verify").trim(),
    validate("verify")
        .required(null, "enter verify")
)

var ApproveEmailForm = form(
    filter("userId").trim(),
    validate("userId")
        .required(null, "enter userId"),

   filter("token").trim(),
    validate("token")
        .required(null, "enter token"),

   filter("email").trim(),
    validate("email")
        .required(null, "enter email")
        .isEmail('need some email')
)

exports.SignupForm = SignupForm;
exports.LoginForm = LoginForm;

exports.ApproveEmailForm = ApproveEmailForm;
exports.ResetPasswordForm = ResetPaswordForm;
exports.ResetPasswordForm2 = ResetPasswordForm2;
exports.AssignWithCafeForm = AssignWithCafeForm;
exports.UpdateNameForm = UpdateNameForm;
exports.UpdateEmailForm = UpdateEmailForm;
exports.UpdatePasswordForm = UpdatePasswordForm;