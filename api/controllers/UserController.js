var models = require('../models/User.js');
var cafeModel = require('../models/Cafe.js');

var forms = require('../../site/forms/UserForms.js');
var User = models.User;
var common = require('../models/CommonFunctions.js');
var sendMail = common.sendMail;

var approveuserInCafe = common.approveuserInCafe;
var assignUserandCafe = common.assignUserandCafe;
var logError = common.logError;
var ShowError = common.ShowError;




function approveUserMailSend(user, encodedToken, email) {
    var approveLink = conf.site_url + "/api/users/approve-email/?userId=" + user._id + "&verify=" + encodedToken+"&email="+email;
    var approveMessage = "Hello, <br/>Click for approve your email in cofeShop System:<br/><a href=\"" + approveLink + "\">" + approveLink + "</a>";

    sendMail(user.email, conf.site_email, conf.site_name + ': approve email', approveMessage,
								function (error, response) {
								    if (error) {
								        console.log(Date.now() + " " + error);
                                        console.log(Date.now() + 'Well done new User Added user email is ' + user.email + ' approve link ' + approveLink);
								    } else {
								        console.log(Date.now() + "Message sent: " + response.message);
                                        console.log(Date.now() + 'Well done new User Added user email is ' + user.email + 'user id is ' + user._id + ' link ' + approveLink);
								    }

								    // if you don't want to use this transport object anymore, uncomment following line
								    //smtpTransport.close(); // shut down the connection pool, no more messages
								});

    
}



function newUser(email,password,username, callback)
{
                                    /*Если не выполнились первые 2 случая, создаем нового пользователя*/
    User.newUser(email, password, username, function (err, user) {
        if ((user) && (!err)) {

            var userId = user._id;

            User.generateNewToken(userId, function (error, token) {
                if (error) {
                    callback(error)
                } else
                    if (token) {
                        approveUserMailSend(user, token, email);
                        callback(null, user)
                    }
            });



        } else {

            logError(Date.now() + 'Cant write email to db');
            if (err)
                logError(err);
            callback("Error on server User with this email exists, please try to remember password");

        }
    });
}

exports.add_routes = function (app) {

    app.get("/users/newUser", function (req, res) { res.render("users/RegisterUser", { title: "newuser" }); });

    app.post("/users/newUser", forms.SignupForm, function (req, res) {
        if (req.form.isValid) {
            /*Проверяем существует ли полностью подтвержденный пользователь*/
            User.findOne({ email: req.form.email }, function (error, user) {
                if (user && user.approve) {
                    //logError(Date.now() + " user exists, try to remember password");
                    ShowError(res, "User Exists try to remember password");
                }
                else {
                    /*Проверяем существует ли пользователь который начал регистрацию*/
                    User.findOne({ tempemail: req.form.email }, function (error, userT) {
                        if (userT && !userT.approve) {
                            //var token = null;
                            User.generateNewToken(userT._id, function (error, token) {
                                if (error) {
                                    ShowError(res, "Error on server can't generate new token for approve email address")
                                } else
                                    if (token) {
                                        approveUserMailSend(userT, token, req.form.email);
                                        ShowError(res, "User Exists but email does not confirm, please confirm it, we just send congirmation link, thanks");
                                    }
                            });
                        } else {
                            if (userT && userT.approve) {
                                User.dropToken(userT._id, function (error, dropTokenUser) {
                                    if (error) ShowError(res, error); else
                                        newUser(req.form.email, req.form.password, req.form.UserName, function (error, user) {
                                            if (error) ShowError(res, error); else
                                                ShowError(res, "Please confirm email");
                                        })
                                });
                            }
                            else {
                                newUser(req.form.email, req.form.password, req.form.UserName, function (error, user) {
                                    if (error) ShowError(res, error); else
                                        ShowError(res, "Please confirm email");
                                });
                            }
                        }
                    });
                }
            });
        }
        else {
            logError(Date.now() + "wrong new User form");
            logError(Date.now() + " " + req.form.errors);
            ShowError(res, "Wrong newUser form")

        }
    });

    app.get('/users/approve-email', function (req, res, next) {
        var userId = req.query.userId;
        var token = req.query.verify;
        var email = req.query.email;
        if (userId && token && email) {
            /*Все сошлось все круто, но может получиться так что уже кто-то подтвердил такой email на другого пользователя, надо бы проверить*/
            User.findOne({ email: email }, function (error, approvedUser) {/*если у пользователя написано email то это значит что он подтвержден*/
                if (!approvedUser) {
                    User.findOne({ _id: userId, tempemail: email }, function (error, user) {
                        if (user && user.token == token) {
                            logError("We find User and token is right");

                            User.approveEmail(userId, email, function (error, result) {
                                if (error) {
                                    ShowError(res, "Cant approveUser some errors in db");
                                }
                                else {
                                    User.dropToken(userId, function (error, result) { if (result) console.log(Date.now() + ' token dropped ' + user.email); });
                                    console.log(Date.now() + ' User approved ' + result.email);
                                    /*после подтверждения пользователя сохраняем его в сессию*/
                                    req.session.regenerate(function () {
                                        req.session.user = user._id;
                                        ShowError(res, 'User approved ' + result.email);
                                    });


                                }
                            });
                        }
                        else {
                            ShowError(res, 'wrong link to approve user');
                        }
                    });
                } else { ShowError(res, "Some one took this email faster than you"); }
            });
        }
        else {
            ShowError(res, 'wrong link to approve user');
        }
    });


    app.get("/users/forgot-password", function (req, res) { res.render("users/ForgotPassword", { title: "RememberPassword" }); });

    app.post(
    		'/users/forgot-password', forms.ResetPasswordForm,
    		function (req, res) {
    		    if (req.form.isValid) {
    		        User.findOne({ email: req.form.email }, function (error, user) {
    		            if (user && user.password) {
    		                var oldPasswordHash = encodeURIComponent(user.password);
    		                var userId = user._id;
    		                var resetLink = conf.site_url + "/users/reset-password/?userId=" + userId + "&verify=" + oldPasswordHash;
    		                var resetMessage = "Hello, <br/>Click for reset password:<br/><a href=\"" + resetLink + "\">" + resetLink + "</a>";

    		                sendMail(user.email, conf.site_email, conf.site_name + ': reset password', resetMessage,
								function (error, response) {
								    if (error) {
								        console.log(error);
								        console.log("reset link " + resetLink);
								        ShowError(res, error);
								    } else {
								        console.log("Message sent: " + response.message);
								        console.log("reset link: " + resetLink);
								        ShowError(res, "Message sent: " + response.message);
								    }
								});

    		            }
    		            else {
    		                ShowError(res, Date.now() + 'cant find user with email ' + req.form.email);
    		            }
    		        });
    		    }
    		    else {
    		        console.log(Date.now() + 'errors on reset pass form');
    		        console.log(Date.now() + " " + req.form.errors);
    		        ShowError(res, "Wrong form");

    		    }
    		});

    app.get('/users/reset-password', function (req, res, next) {
        var userId = req.query.userId;
        var verify = decodeURIComponent(req.query.verify);
        var password = '';
        if (userId && verify) {
            User.findOne({ _id: userId }, function (error, user) {
                if (user && user.password == verify) {
                    User.resetPassword(userId, function (error, result) {
                        if (error) {
                            console.log('Cant reset password');
                            ShowError(res, "Cant reset password");
                        }
                        else {
                            password = result;
                            sendMail(user.email, conf.site_email, 'New password', password,
                            function (error, response) {
                                if (error) {
                                    console.log(error);
                                    console.log("new password " + password);
                                } else {
                                    //console.log("Message sent: " + response.message);
                                    ShowError(res, "Message sent: " + response.message)
                                    //ShowError(res, "Your new password on your email " + password);
                                }
                            });

                        }
                    });
                }
                else {
                    ShowError(res, 'wrong link to reset password');
                }
            });
        }
        else {
            ShowError(res, 'wrong link to reset password');
        }
    });

    app.get('/users/logout', function (req, res) {
        req.session.destroy(function () {
            res.redirect('users/login');
        });
    });

    app.get("/users/login", function (req, res) { res.render("users/Login", { title: "Login" }); });

    app.post('/users/login', forms.LoginForm, function (req, res) {
        if (req.form.isValid) {
            console.log(Date.now() + ' valid login form');
            User.authenticate(
                    req.form.email, req.form.password,
                    function (err, user) {
                        if (user) {
                            console.log(Date.now() + ' user id ' + user._id);
                            req.session.regenerate(function () {
                                req.session.user = user._id;
                                /*Ура пользователь залогинился, надо куда-то его отправить*/
                                res.redirect(req.body.redir || '/');
                            });
                        } else {
                            console.log(Date.now() + ' cant find user or he does not approve');
                            if (!req.session.errors)
                                req.session.errors = [];
                            ShowError(res, Date.now() + " cant find user or he does not approve")
                        }
                    });
        } else {
            console.log(Date.now() + ' INvalid login form');
            res.redirect('users/login');
        }

    });

    app.get("/users/assignwithcafe", function (req, res) { res.render("users/AssignWithCafe", { title: "AssignWithCafe" }); });

    app.post('/users/assignwithcafe', forms.AssignWithCafeForm, function (req, res) {
        if (req.form.isValid) {
            assignUserandCafe(req.form.userId, req.form.cafeId, function (error, result) {
                if (error) ShowError(res, error); else
                    ShowError(res, result);
            });
        } else { ShowError(res, "error in assign form"); }
    });

    app.get("/users/approveuserincafe", function (req, res) { res.render("users/ApproveInCafe", { title: "ApproveInCafe" }); });

    app.post('/users/approveuserincafe', forms.AssignWithCafeForm, function (req, res) {
        if (req.session.user)/*если сотрудник кафе авторизован, то он сможет подтвердить что еще кто-то является сотрудником*/
        {
            if (req.form.isValid) {
                User.findOne({ _id: req.session.user }, function (error, user) {/*ищем сначала авторизованого юзера*/
                    if (error) ShowError(res, error); else
                        if (user.approveInCurrentCafe && user._cafe && user._cafe == req.form.cafeId) {/*проеряем его принадлежность к нужному кафе*/
                            approveuserInCafe(req.form.userId, req.form.cafeId, function (error, result) {
                                if (error) ShowError(res, error); else
                                    ShowError(res, result);
                            })
                        } else
                        { ShowError(res, "authorized user from another cafe") }
                });
            } else { ShowError(res, "error in approve form"); }
        }
        else { res.redirect('users/login'); }
    });


    app.get('/users/getcafe/:userId', function (req, res) {
        User.findOne({ _id: req.params.userId }).populate('_cafe').exec(function (error, user) {
            if (error) { ShowError(res, error) } else
                if (user) ShowError(res, user._cafe); else
                    ShowError(res, null);
        });
    });

    app.get('/users/getuser/:userId', function (req, res) {
        User.findOne({ _id: req.params.userId }, function (error, user) {
            if (error) ShowError(res, error); else
                ShowError(res, user);
        });
    });

    app.get("/users/updateUserName", function (req, res) { res.render("users/updateUserName", { title: "updateUserName" }); });

    app.post('/users/updateUserName', forms.UpdateNameForm, function (req, res) {
        if (req.session.user)/*Если человек не авторизован, то он не может сменить себе имя*/
        {
            if (req.form.isValid) {
                User.findOne({ _id: req.session.user }, function (error, user) {
                    if (error) ShowError(res, error); else
                        User.UpdateName(user._id, req.form.UserName, function (error, newName) {
                            if (error) ShowError(res, error); else
                                ShowError(res, newName);
                        });
                });
            } else { ShowError(res, "Error on updateUserNameFrom"); }
        } else { res.redirect('users/login'); }
    });

    app.get("/users/updateEmail", function (req, res) { res.render("users/UpdateEmail", { title: "UpdateEmail" }); });

    app.post('/users/UpdateEmail', forms.UpdateEmailForm, function (req, res) {
        if (req.session.user)/*Если человек не авторизован, то он не может сменить себе email*/
        {
            if (req.form.isValid) {
                User.findOne({ _id: req.session.user }, function (error, user) {
                    if (error) ShowError(res, error); else

                        User.findOne({ email: req.form.email }, function (error, userE) {
                            if (userE) ShowError(res, "Email in use"); /*email уже занят*/
                            else/*Есть баг, надо искать не первого попавшегося юзера с таким email а всех, их может быть много, и всем сбрасывать*/
                                User.findOne({ tempemail: req.form.email }, function (error, userTmp) {
                                    if (userTmp) {/*Кто-то уже хотел занять этот email, но еще не занял*/
                                        User.dropToken(userTmp._id, function (error, result) {/*если пользователь не подтверди ни одного email то мы его удалим */
                                            if (error) ShowError(res, error); else
                                                User.UpdateEmail(user._id, req.form.email, function (error, newEmail) {
                                                    if (error) ShowError(res, error); else {
                                                        var userId = user._id;

                                                        User.generateNewToken(userId, function (error, token) {
                                                            if (error) ShowError(res, error); else
                                                                if (token) {
                                                                    approveUserMailSend(user, token, req.form.email);
                                                                    ShowError(res, "Please confirm new email, we just send congirmation link, thanks");
                                                                }
                                                        });
                                                    }
                                                });
                                        });
                                    }
                                    else {/*Пока никто не хотел его занять занимаем сами*/
                                        User.UpdateEmail(user._id, req.form.email, function (error, newEmail) {
                                            if (error) ShowError(res, error); else {
                                                var userId = user._id;

                                                User.generateNewToken(userId, function (error, token) {
                                                    if (error) ShowError(res, error); else
                                                        if (token) {
                                                            approveUserMailSend(user, token, req.form.email);
                                                            ShowError(res, "Please confirm new email, we just send congirmation link, thanks");
                                                        }
                                                });
                                            }
                                        });
                                    }
                                });
                        });
                });
            } else { ShowError(res, "Error on updateEmailFrom"); }
        } else { res.redirect('users/login'); }
    });

    app.get("/users/updatePassword", function (req, res) { res.render("users/UpdatePassword", { title: "UpdatePassword" }); });

    app.post('/users/UpdatePassword', forms.UpdatePasswordForm, function (req, res) {
        if (req.session.user)/*Если человек не авторизован, то он не может сменить себе пароль*/
        {
            if (req.form.isValid) {
                User.findOne({ _id: req.session.user }, function (error, user) {
                    if (error) ShowError(res, error); else {
                        console.log(req.form.NewPassword);
                        console.log(req.form.PasswordConfirmation);
                        if (req.form.NewPassword == req.form.PasswordConfirmation) {
                            User.UpdatePassword(req.session.user, req.form.OldPassword, req.form.NewPassword, function (error, resUser) {
                                if (error) ShowError(res, error); else
                                    if (resUser) ShowError(res, resUser);
                            })
                        } else { ShowError(res, "Error password not equal password confirm"); }
                    }
                })
            } else { ShowError(res, "Error on newPasswordForm"); }
        } else { res.redirect('users/login'); }
    });
}
