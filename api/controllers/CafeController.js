var models = require('../models/Cafe.js');
var forms = require('../../site/forms/CafeForms.js');
var User = require('../models/User.js').User;
var Menu = require('../models/Menu.js').Menu;
var common = require('../models/CommonFunctions.js');
var sendMail = common.sendMail;
var sendSMS = common.sendSMS;

var approveuserInCafe = common.approveuserInCafe;
var assignUserandCafe = common.assignUserandCafe;
var logError = common.logError;
var ShowError = common.ShowError;


var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;



exports.add_routes = function (app) {

    app.get("/cafes/newCafe", function (req, res) { res.render("cafes/newCafe", { title: "newCafe" }); });

    app.post('/cafes/newCafe', forms.createCafeForm, function (req, res) {
        if (req.session.user) {
            if (req.form.isValid) {
                User.findOne({ _id: req.session.user }, function (error, user) {
                    if (error) ShowError(res, error);
                    else {
                        Cafe.findOne({ CellPhone: req.form.CellPhone }, function (error, cafeWithApprovedCellPhone) {
                            if (!cafeWithApprovedCellPhone) {
                                Cafe.newCafe(req.form, function (error, cafe) {

                                    if (error) ShowError(res, error); else {
                                        console.log(cafe);
                                        Menu.newMenu(cafe._id, { Name: "NewMenu", Description: "NewDescription" }, function (error, menu) {
                                            if (error) ShowError(res, error);
                                        });
                                        assignUserandCafe(user._id, cafe._id, function (error, userAssigned) {
                                            if (error) ShowError(res, error); else {
                                                console.log(userAssigned)
                                                approveuserInCafe(userAssigned, cafe, function (error, val) {
                                                    if (error) ShowError(res, error); else {
                                                        sendSMS(SMSconf, cafe.tempCellPhone, cafe.CellPhoneVerificationCode, function (data, response) {
                                                            logError("CellPhoneApprovelink " + conf.site_url + "/cafes/approve-CellPhone?cafeId=" + cafe._id.toString() + "&token=" + cafe.CellPhoneVerificationCode + "&cellPhone=" + encodeURIComponent(cafe.tempCellPhone));
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
        User.getAllApprovedUsersInCafe(req.params.cafeId, function (error, users) {
            if (error) ShowError(res, error);
            else ShowError(res, users)
        });
    });

    app.get("/cafes/getAllUsers/:cafeId", function (req, res) {
        User.getAllUsersInCafe(req.params.cafeId, function (error, users) {
            if (error) ShowError(res, error);
            else ShowError(res, users)
        });
    });

    app.get("/api/cafes/:cafeId", function (req, res) {
        Cafe.findOne({ _id: req.params.cafeId }, function (error, cafe) {
            if (error) ShowError(res, error); else {
                 console.log(req.params.cafeId);
                res.json(cafe, 200)
            }
        });
    });

    app.get("/cafes/updateValues/:cafeId", function (req, res) {
        if (req.session.user) {
            Cafe.findOne({ _id: req.params.cafeId }, function (error, cafe) {
                if (error) ShowError(res, error); else
                    res.render("cafes/admin", { title: "UpdateCafeValues", cafe: cafe });
            });
        } else { res.redirect('users/login'); }
    });

    app.post("/cafes/updateValues", forms.updateCafeForm, function (req, res) {
        if (req.session.user) {
            if (req.form.isValid) {
                User.findOne({ _id: req.session.user }, function (error, user) {
                    if (error) ShowError(res, error);
                    else {
                        logError(user.approve);
                        logError(user.approveInCurrentCafe);
                        logError(user._cafe);
                        logError(req.form.cafeId);
                        logError(req.form);
                        if (user.approve && user.approveInCurrentCafe && user._cafe && user._cafe == req.form.cafeId)
                            Cafe.UpdateCafeValue(req.form.cafeId, req.form, function (error, cafe) {
                                if (error) ShowError(res, error);
                                else res.redirect('cafes/updatevalues/' + cafe._id);
                            });
                        else { ShowError(res, 'User not from this cafe'); }
                    }
                });
            } else { ShowError(res, 'WrongForm'); }
        } else { res.redirect('users/login'); }
    })

    app.get("/cafes/updateCellPhone/:cafeId", function (req, res) {
        Cafe.findOne({ _id: req.params.cafeId }, function (error, cafe) {
            if (error) ShowError(res, error); else
                res.render("cafes/UpdateCellPhone", { title: "updateCellPhone", cafe: cafe });
        });
    });

    app.post("/cafes/updateCellPhone", forms.UpdateCafeCellPhoneForm, function (req, res) {
        if (req.session.user) {

            User.findOne({ _id: req.session.user }, function (error, user) {
                if (error) ShowError(res, error);
                else {
                    if (user.approve && user.approveInCurrentCafe && user._cafe && user._cafe == req.form.cafeId)
                        Cafe.findOne({ CellPhone: req.form.CellPhone }, function (error, approvedCafe) {
                            if (!approvedCafe) {
                                Cafe.UpdateCellPhone(req.form.cafeId, req.form.CellPhone, function (error, cafe) {
                                    if (error) ShowError(res, error);
                                    else {
                                        sendSMS(SMSconf, cafe.tempCellPhone, cafe.CellPhoneVerificationCode, function (data, response) {
                                            logError("CellPhoneApprovelink " + conf.site_url + "/cafes/approve-CellPhone?cafeId=" + cafe._id.toString() + "&token=" + cafe.CellPhoneVerificationCode + "&cellPhone=" + encodeURIComponent(cafe.tempCellPhone));
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
            Cafe.findOne({ CellPhone: cellPhone }, function (error, cafeApprovedCellPhone) {
                if (!cafeApprovedCellPhone) {
                    Cafe.findOne({ _id: cafeId, tempCellPhone: cellPhone.toString(), CellPhoneVerificationCode: token }, function (error, cafe) {
                        if (cafe && cafe.CellPhoneVerificationCode == token) {
                            logError("We find cafe and token is right");
                            Cafe.approveCellPhone(cafeId, cellPhone, function (error, result) {
                                if (error) {
                                    ShowError(res, "Cant approveCafeCellPhone some errors in db");
                                }
                                else {
                                    Cafe.dropToken(cafeId, function (error, result) { if (result) console.log(Date.now().toString() + ' token dropped ' + cafe.CellPhone); });
                                    console.log(Date.now().toString() + ' Cafe CellPhone is approved ' + result.CellPhone);
                                    res.render("cafes/admin", { cafe: cafe });
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