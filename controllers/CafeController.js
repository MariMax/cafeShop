var models = require('../models/Cafe.js');
var forms = require('../forms/CafeForms.js');
var Users = require('../models/User.js');
var common = require('../models/CommonFunctions.js');
var sendMail = common.sendMail;
var sendSMS = common.sendSMS;

var approveuserInCafe = common.approveuserInCafe;
var assignUserandCafe = common.assignUserandCafe;
var logError = common.logError;
var ShowError = common.ShowError;

var Dish = models.Dish;

var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;



exports.add_routes = function (app) {

    app.get("/cafes/newCafe", function (req, res) { res.render("cafes/newCafe", { title: "newCafe" }); });

    app.post('/cafes/newCafe', forms.createCafeForm, function (req, res) {
        if (req.session.user) {
            if (req.form.isValid) {
                Users.findOne({ _id: req.session.user }, function (error, user) {
                    if (error) ShowError(res, error);
                    else {
                        Cafe.findOne({ CellPhone: req.form.CellPhone }, function (error, cafeWithApprovedCellPhone) {
                            if (!cafeWithApprovedCellPhone) {
                                Cafe.newCafe(req.form, function (error, cafe) {

                                    if (error) ShowError(res, error); else {
                                        console.log(cafe);
                                        assignUserandCafe(user._id, cafe._id, function (error, userAssigned) {
                                            if (error) ShowError(res, error); else {
                                                console.log(userAssigned)
                                                approveuserInCafe(userAssigned._id, cafe._id, function (error, val) {
                                                    if (error) ShowError(res, error); else {
                                                        sendSMS(SMSconf, cafe.tempCellPhone, cafe.CellPhoneVerificationCode, function (data, response) {
                                                            ShowError(res, "Wait SMS whith verify Code for approve cafe");
                                                        });
                                                    }
                                                })
                                            }
                                        })
                                    }
                                });
                            } else {
                                ShowError(res, "This CellPhone Number exist in our system, you should use another number")
                            }
                        });
                    }
                });
            } else { ShowError(res, 'WrongForm'); }
        } else { res.redirect('users/login'); }
    });

    app.get("/cafes/getApprovedUsers/:cafeId", function (req, res) {
        Users.getAllApprovedUsersInCafe(req.params.cafeId, function (error, users) {
            if (error) ShowError(res, error);
            else ShowError(res, users)
        });
    });

    app.get("/cafes/getAllUsers/:cafeId", function (req, res) {
        Users.getAllUsersInCafe(req.params.cafeId, function (error, users) {
            if (error) ShowError(res, error);
            else ShowError(res, users)
        });
    });

    app.get("/cafes/updateValue/:cafeId", function (req, res) {
        if (req.session.user) {

            Users.findOne({ _id: req.session.user }, function (error, user) {
                if (error) ShowError(res, error);
                else {
                    if (user.approve && user.approveInCurrentCafe && user._cafe && user._cafe.toString() == req.params.cafeId.toString())
                        Cafe.UpdateValue(req.params.cafeId, req.body, function (error, cafe) {
                            if (error) ShowError(res, error);
                            else ShowError(res, cafe);
                        });
                }
            });

        } else { res.redirect('users/login'); }
    })

    app.get("/cafes/updateCellPhone/:cafeId", function (req, res) {
        if (req.session.user) {

            Users.findOne({ _id: req.session.user }, function (error, user) {
                if (error) ShowError(res, error);
                else {
                    if (user.approve && user.approveInCurrentCafe && user._cafe && user._cafe.toString() == req.params.cafeId.toString())
                        Cafe.findOne({ CellPhone: req.params.CellPhone }, function (error, approvedCafe) {
                            if (!approvedCafe) {
                                Cafe.UpdateCellPhone(req.params.cafeId, req.params.CellPhone, function (error, cafe) {
                                    if (error) ShowError(res, error);
                                    else {
                                        sendSMS(SMSconf, cafe.tempCellPhone, cafe.CellPhoneVerificationCode, function (data, response) {
                                            ShowError(res, "Wait SMS whith verify Code");
                                        })
                                    }
                                });
                            } else { ShowError(res, "This CellPhone Number exist in our system, you should use another number"); }
                        });
                }
            });

        } else { res.redirect('users/login'); }
    });

    app.get('/cafes/approve-CellPhone', function (req, res, next) {
        var cafeId = req.query.cafeId;
        var token = req.query.token;
        var cellPhone = req.query.cellPhone;
        if (cafeId && token && cellPhone) {
            cafeId.findOne({ CellPhone: cellPhone }, function (error, cafeApprovedCellPhone) {
                if (!cafeApprovedCellPhone) {
                    Cafe.findOne({ _id: cafeId, tempCellPhone: cellPhone }, function (error, cafe) {
                        if (cafe && cafe.CellPhoneVerificationCode == token) {
                            logError("We find cafe and token is right");
                            Cafe.approveCellPhone(cafeId, cellPhone, function (error, result) {
                                if (error) {
                                    ShowError(res, "Cant approveCafeCellPhone some errors in db");
                                }
                                else {
                                    Cafe.dropToken(cafeId, function (error, result) { if (result) console.log(Date.now().toString() + ' token dropped ' + cafe.CellPhone); });
                                    console.log(Date.now().toString() + ' Cafe CellPhone is approved ' + result.CellPhone);
                                    /*после подтверждения пользователя сохраняем его в сессию*/

                                    ShowError(res, 'Cafe CellPhone is approved ' + result.CellPhone);


                                }
                            });
                        }
                        else {
                            ShowError(res, 'wrong Verification code');
                        }
                    });
                } else { ShowError(res, "Some one took this cellPhone faster than you ") }
            });
        }
        else {
            ShowError(res, 'I need additional data: cafeId, VerificationCode, verification cellphone');
        }
    });



}