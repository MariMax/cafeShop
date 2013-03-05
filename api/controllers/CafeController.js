var models = require('../models/Cafe.js');
var forms = require('../forms/CafeForms.js');
var User = require('../models/User.js').User;
var Menu = require('../models/Menu.js').Menu;
var common = require('../models/CommonFunctions.js');
var sendMail = common.sendMail;
var sendSMS = common.sendSMS;

var approveuserInCafe = common.approveuserInCafe;
var assignUserandCafe = common.assignUserandCafe;
var logError = common.logError;
var ShowMessage = common.ShowMessage;


var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;



exports.add_routes = function (app) {

    app.post('/api/cafes/newCafe', forms.createCafeForm, function (req, res) {

        if (req.form.isValid) {
            User.findOne({ _id: req.form.userId }, function (error, user) {
                if (error) ShowMessage(res, "Не удалось найти пользователя, под которым вы зашли", 500);
                else {
                    Cafe.findOne({ CellPhone: req.form.cellPhone }, function (error, cafeWithApprovedCellPhone) {
                        if (!cafeWithApprovedCellPhone) {
                            Cafe.newCafe(req.form, function (error, cafe) {

                                if (error) ShowMessage(res, "Не удалось создать кафе, попробуйте еще раз позже", 500); else {
                                    console.log(cafe);
                                    Menu.newMenu(cafe._id, { Name: "NewMenu", Description: "NewDescription" }, function (error, menu) {
                                        if (error) ShowMessage(res, "Не удалось создать еню в кафе", 500);
                                    });
                                    assignUserandCafe(user._id, cafe._id, function (error, userAssigned) {
                                        if (error) ShowMessage(res, "Не удалось связать пользователя и кафе", 500); else {
                                            console.log(userAssigned)
                                            approveuserInCafe(userAssigned, cafe, function (error, val) {
                                                if (error) ShowMessage(res, "Не удалось подтвердить пользователя в кафе", 500); else {
                                                    sendSMS(SMSconf, cafe.tempCellPhone, cafe.CellPhoneVerificationCode, function (data, response) {
                                                        logError("CellPhoneApprovelink " + conf.site_url + "/api/cafes/approve-CellPhone?cafeId=" + cafe._id.toString() + "&token=" + cafe.CellPhoneVerificationCode + "&cellPhone=" + encodeURIComponent(cafe.tempCellPhone));
                                                        ShowMessage(res, { message: "Вам отправлено SMS сообщение с кодом подтверждения телефона", cafeId: cafe._id }, 200);
                                                    });
                                                }
                                            })
                                        }
                                    });
                                    Category.newCategory(cafe._id, 1, "zavtraki", "Завтраки", function (data) { }, function (error) {
                                        logError("Category.newCategory "+error);
                                    });
                                    Category.newCategory(cafe._id, 2, "goryachie", "Горячие блюда", function (data) { }, function (error) {
                                        logError("Category.newCategory "+error);
                                    });
                                    Category.newCategory(cafe._id, 3, "salat", "Салаты", function (data) { }, function (error) {
                                        logError("Category.newCategory "+error);
                                    });
                                    Category.newCategory(cafe._id, 4, "sup", "Супы", function (data) { }, function (error) {
                                        logError("Category.newCategory "+error);
                                    });
                                    Category.newCategory(cafe._id, 5, "garnir", "Гарниры", function (data) { }, function (error) {
                                        logError("Category.newCategory "+error);
                                    });
                                    Category.newCategory(cafe._id, 6, "desert", "Десерт", function (data) { }, function (error) {
                                        logError("Category.newCategory "+error);
                                    });
                                    Category.newCategory(cafe._id, 7, "drink", "Напитки", function (data) { }, function (error) {
                                        logError("Category.newCategory "+error);
                                    });
                                }
                            });
                        } else {
                            ShowMessage(res, "Этот номер телефона уже зареистрирован за другим кафе, пожалуйста введите новый номер", 500)
                        }
                    });
                }
            });
        } else { ShowMessage(res, 'Неверно заполнена форма регистрации нового кафе', 500); }

    });

    app.post("/api/cafes/getApprovedUsers/:cafeId", function (req, res) {
        User.getAllApprovedUsersInCafe(req.params.cafeId, function (error, users) {
            if (error) res.json(null, 200);
            else res.json(users, 200);
        });
    });

    app.post("/api/cafes/getAllUsers/:cafeId", function (req, res) {
        User.getAllUsersInCafe(req.params.cafeId, function (error, users) {
            if (error) res.json(null, 200);
            else res.json(users, 200);
        });
    });

    app.get("/api/cafes/:cafeId", function (req, res) {
        Cafe.findOne({ _id: req.params.cafeId }, function (error, cafe) {
            if (error) res.json(null, 200); else {

                cafe.CellPhoneVerificationCode = '';

                res.json(cafe, 200);
            }
        });
    });

    app.post("/api/cafes/updateValues", forms.updateCafeForm, function (req, res) {

        if (req.form.isValid) {
            User.findOne({ _id: req.session.user }, function (error, user) {
                if (error) ShowMessage(res, "Не удалось найти пользователя", 500);
                else {
                    logError(user.approve);
                    logError(user.approveInCurrentCafe);
                    logError(user._cafe);
                    logError(req.form.cafeId);
                    logError(req.form);
                    if (user.approve && user.approveInCurrentCafe && user._cafe && user._cafe == req.form.cafeId)
                        Cafe.UpdateCafeValue(req.form.cafeId, req.form, function (error, cafe) {
                            if (error) ShowMessage(res, 'Не удалось обновить данные', 500);
                            else ShowMessage(res, 'Данные успешно обновлены', 200);
                        });
                    else { ShowMessage(res, 'Пользователь не из этого кафе', 500); }
                }
            });
        } else { ShowMessage(res, 'Неверно заполнены параметры формы', 500); }

    })

    app.post("/api/cafes/updateCellPhone", forms.UpdateCafeCellPhoneForm, function (req, res) {
        if (req.form.isValid) {
            User.findOne({ _id: req.session.user }, function (error, user) {
                if (error) ShowMessage(res, "Не удалось найти пользователя", 500);
                else {
                    if (user.approve && user.approveInCurrentCafe && user._cafe && user._cafe == req.form.cafeId)
                        Cafe.findOne({ CellPhone: req.form.cellPhone }, function (error, approvedCafe) {
                            if (!approvedCafe) {
                                logError(req.form.cafeId);
                                logError(req.form.cellPhone);
                                Cafe.UpdateCellPhone(req.form.cafeId, req.form.cellPhone, function (error, cafe) {
                                    if (error) ShowMessage(res, "Не удалось обновить номер телефона", 500);
                                    else {
                                        sendSMS(SMSconf, cafe.tempCellPhone, cafe.CellPhoneVerificationCode, function (data, response) {
                                            logError("CellPhoneApprovelink " + conf.site_url + "/api/cafes/approve-CellPhone?cafeId=" + cafe._id.toString() + "&token=" + cafe.CellPhoneVerificationCode + "&cellPhone=" + encodeURIComponent(cafe.tempCellPhone));
                                            ShowMessage(res, "На Ваш номер отправлена SMS с кодом подтверждения", 200);
                                        })
                                    }
                                });
                            } else { ShowMessage(res, "Данный номер телефона уже зарегистрирован, используйте другой номер", 500); }
                        });
                }
            });

        } else { ShowMessage(res, 'Неверно заполнена форма изменения номера телефона', 500); }
    });

    app.post('/api/cafes/approve-CellPhone', forms.ConfirmCafeCellPhoneForm, function (req, res, next) {

        if (req.form.isValid) {
            logError("approve cellPhoneForm Valid");
            var cafeId = req.form.cafeId;
            var token = req.form.token;
            var cellPhone = req.form.cellPhone;
            logError(cafeId);
            logError(token);
            logError(cellPhone);
            Cafe.findOne({ CellPhone: cellPhone }, function (error, cafeApprovedCellPhone) {
                if (!cafeApprovedCellPhone) {
                    Cafe.findOne({ _id: cafeId, tempCellPhone: cellPhone.toString(), CellPhoneVerificationCode: token }, function (error, cafe) {
                        if (cafe && cafe.CellPhoneVerificationCode == token) {
                            logError("We find cafe and token is right");
                            Cafe.approveCellPhone(cafeId, cellPhone, function (error, result) {
                                if (error) {
                                    ShowMessage(res, "Не удалось подтвердить номер телефона, попробуйте зарегистрироваться еще раз ", 500);
                                }
                                else {
                                    Cafe.dropToken(cafeId, function (error, result) { if (result) console.log(Date.now().toString() + ' token dropped ' + cafe.CellPhone); });
                                    console.log(Date.now().toString() + ' Cafe CellPhone is approved ' + result.CellPhone);
                                    //res.render("cafes/admin", { cafe: cafe });
                                    ShowMessage(res, { message: "Номер телефона подтвержден", cafeId: cafeId }, 200);
                                }
                            });
                        }
                        else {
                            ShowMessage(res, 'Неверный код подтверждения', 500);
                        }
                    });
                } else { ShowMessage(res, "Кто-то уже подтвердил этот номер, придется ввести другой", 500) }
            });
        }
        else {
            ShowMessage(res, 'Неверно заполнена форма подтверждения номера телефона', 500);
        }
    });



}