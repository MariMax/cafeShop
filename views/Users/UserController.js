var models = require('../models/User.js');
var forms = require('../forms/UserForms.js');
var User = models.User;
var common = require('../models/CommonFunctions.js');
var sendMail = common.sendMail;
var cafeModel = require('../models/Cafe.js');


function approveUserMailSend(user, encodedToken, email) {
    var approveLink = conf.site_url + "/users/approve-email/?userId=" + user._id + "&verify=" + encodedToken+"&email="+email;
    var approveMessage = "Hello, <br/>Click for approve your email in cofeShop System:<br/><a href=\"" + approveLink + "\">" + approveLink + "</a>";

    sendMail(user.email, conf.site_email, conf.site_name + ': approve email', approveMessage,
								function (error, response) {
								    if (error) {
								        console.log(Date.now() + " " + error);
								    } else {
								        console.log(Date.now() + "Message sent: " + response.message);
								    }

								    // if you don't want to use this transport object anymore, uncomment following line
								    //smtpTransport.close(); // shut down the connection pool, no more messages
								});

    console.log(Date.now() + 'Well done new User Added user email is ' + user.email + 'user id is ' + user._id + ' link ' + approveLink);
}

function assignUserandCafe(userId,cafeId, callback)
{
    User.findOne({ _id: userId }, function (error, user) {
        if (error) { return callback(error) }
        cafeModel.findOne({ _id: cafeId }, function (error, cafe) {
            if (error) { return callback(error) }
            User.assignWithCafe(cafe._id, user._id, function (error, val) {
                if (error) { return callback(error) }
                callback(null, val);
            })
        });
    });
}

function approveuserInCafe(userId,cafeId, callback)
{
    Users.findOne({ _id: userId }, function (error, requestedUser) {/*Ищем подтверждаемого юзера*/
        if (error) { return callback(error) }
        if (requestedUser._cafe && requestedUser._cafe == cafeId) {/*проверяем его принадлежность к кафе*/
            User.approveInCafe(cafeId, requestedUser._id, function (error, result) {/*если все сошлось подтверждаем юзера*/
                if (error) { return callback(error) }
                return callback(null, result)
            })
        }
        return callback("confirm user from another cafe");
    })
}

function logError(error) {
    if (error) {
        console.log(error);
    }
}
function ShowError(response, error) {
    if (error) {
        logError(error);
        response.json({ message: error });
    }
}

exports.add_routes = function (app) {

    app.get("/users/newUser", function (req, res) { res.render("users/RegisterUser", { title: "newuser" }); });

    app.post("/users/newUser", forms.SignupForm, function (req, res) {
        if (req.form.isValid) {
            /*Проверяем существует ли полностью подтвержденный пользователь*/
            User.findOne({ email: req.form.email }, function (error, user) {
                if (user && user.approve) {
                    //logError(Date.now() + " user exists, try to remember password");
                    res.json({ errMsg: "User Exists try to remember password" });
                }
                else {
                    /*Проверяем существует ли пользователь который начал регистрацию*/
                    User.findOne({ tmpemail: req.form.email }, function (error, user) {
                        if (user && !user.approve) {
                            //var token = null;
                            User.generateNewToken(user._id, function (error, token) {
                                if (error) {
                                    res.json({ errMsg: "Error on server can't generate new token for approve email address" })
                                }
                                if (token) {
                                    approveUserMailSend(user, token, req.form.email);
                                    res.json({ Msg: "User Exists but email does not confirm, please confirm it, we just send congirmation link, thanks" });
                                }
                            });
                        } else {

                            /*Если не выполнились первые 2 случая, создаем нового пользователя*/
                            User.newUser(
                    req.form.email, req.form.password, req.form.UserName,
                            /*то что вызывается когда пользователь записан в БД*/
                    function (err, user) {
                        if ((user) && (!err)) {
                            /* req.session.regenerate(function () {
                            req.session.user = user._id;
                            //res.redirect('/home/');
                                
                            });
                            */
                            var userId = user._id;

                            User.generateNewToken(userId, function (error, token) {
                                if (error) {
                                    res.json({ errMsg: "Error on server can't generate new token for approve email address" })
                                }
                                if (token) {
                                    approveUserMailSend(user, token, req.form.email);
                                    res.json({ Msg: "Please confirm email, we just send congirmation link, thanks" });
                                }
                            });


                            //req.render('/home', { message: "PLEASE approve, see your email" });
                        } else {
                            // if (err.errors.email) {
                            //req.session.errors.push(err.errors.email.type);
                            logError(Date.now() + 'Cant write email to db');
                            res.json({ errMsg: "Error on server User with this email exists, please try to remember password" })

                            // }
                            //res.redirect('/');
                        }
                    });
                        } 
                    });
                } 
            });
        }
        else {
            logError(Date.now() + "wrong new User form");
            logError(Date.now() + " " + req.form.errors);
            res.json({ errMsg: "Wrong newUser form" })
            //req.render('/home', { message: "wrong new User form" });
            //req.session.errors = _.union(req.session.errors || [],
            //      req.form.errors);
            //res.redirect('back');
        }
    });

    app.get('/users/approve-email', function (req, res, next) {
        var userId = req.query.userId;
        var token = req.query.verify;
        var email = req.query.email;
        if (userId && token && email) {
            User.findOne({ _id: userId, tmpemail: email }, function (error, user) {
                if (user && user.token == token) {
                    logError("We find User and token is right");
                    User.dropToken(userId, function (error, result) { if (result) console.log(Date.now() + ' token dropped ' + user.email); });
                    User.approveEmail(userId, function (error, result) {
                        if (error) {
                            ShowError(res, "Cant approveUser some errors in db");
                        }
                        else {
                            console.log(Date.now() + ' User approved ' + user.email);
                            /*после подтверждения пользователя сохраняем его в сессию*/
                            req.session.regenerate(function () {
                                req.session.user = user._id;
                            });

                            ShowError(res, 'User approved ' + user.email);
                        }
                    });
                }
                else {
                    ShowError(res, 'wrong link to approve user');
                }
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
								        console.log(resetLink);
								        ShowError(res, error);
								    } else {
								        console.log("Message sent: " + response.message);
								        console.log("reset link: " + resetLink);
								        ShowError(res, "Message sent: " + response.message);
								    }
								});

    		            }
    		            else {
    		                ShowError(res, Date.now() + 'reset pass Email for user ' + user.email + ' not send');
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
                            req.session.errors.push(
    							'Cant resetpassword');
                            console.log('Cant reset password');
                            ShowError(res, "Cant reset password");
                        }
                        else {
                            password = result;
                            sendMail(user.email, conf.site_email, 'New password', password,
                            function (error, response) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log("Message sent: " + response.message);
                                }
                            });
                            ShowError(res, "Your new password on your email " + password);
                        }
                    });
                }
                else {
                    req.session.errors.push(
    					'it is wrong link');
                    console.log('wrong link to reset password');
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
                if (error) ShowError(res, error);
                ShowError(res, result);
            });
        } ShowError(res, "error in assign form");
    });

    app.get("/users/approveuserincafe", function (req, res) { res.render("users/ApproveInCafe", { title: "ApproveInCafe" }); });

    app.post('/users/approveuserincafe', forms.AssignWithCafeForm, function (req, res) {
        if (req.session.user)/*если сотрудник кафе авторизован, то он сможет подтвердить что еще кто-то является сотрудником*/
        {
            if (req.form.isValid) {
                User.findOne({ _id: req.session.user }, function (error, user) {/*ищем сначала авторизованого юзера*/
                    if (error) ShowError(res, error);
                    if (user.approveInCurrentCafe && user._cafe && user._cafe == req.form.cafeId) {/*проеряем его принадлежность к нужному кафе*/
                        approveuserInCafe(req.form.userId, req.form.cafeId, function (error, result) {
                            if (error) ShowError(res, error);
                            ShowError(res, result);
                        })
                    }
                    ShowError(res, "authorized user from another cafe")
                });
            } ShowError(res, "error in approve form");
        }
        res.redirect('users/login');
    });


    app.get('/users/createselfcafe', function (req, res) {
        if (req.session.user) {
            User.findOne({ _id: req.session.user }, function (error, user) {
                if (error) ShowError(res, error);
                var data = {};
                data.Name = user.UserName;
                cafeModel.newCafe(data, function (error, cafe) {
                    if (error) ShowError(res, error);
                    assignUserandCafe(user._id, cafe._id, function (error, val) {
                        if (error) ShowError(res, error);
                        approveuserInCafe(user._id, cafe._id, function (error, val) {
                            if (error) ShowError(res, error);
                            ShowError(res, val);
                        })
                    })
                });
            });
        } res.redirect('users/login');
    });

    app.get('/users/getcafe/:userId', function (req, res) {
        User.findOne({ _id: req.params.userId }).populate('_cafe', '_id').exec(function (error, user) {
            if (error) { logError(res, error); res.redirect('/'); }
            res.json(user._cafe._id);
            //res.json(null);
        });
    });

    app.get('/users/getuser/:userId', function (req, res) {
        User.findOne({ _id: req.params.userId }, function (error, user) {
            if (error) ShowError(res, error);
            res.json(user);
        });
    });

    app.get("/users/updateUserName", function (req, res) { res.render("/users/updateUserName", { title: "updateUserName" }); });

    app.post('/users/updateUserName', forms.UpdateNameForm, function (req, res) {
        if (req.session.user)/*Если человек не авторизован, то он не может сменить себе имя*/
        {
            if (req.form.isValid) {
                User.findOne({ _id: req.session.user }, function (error, user) {
                    if (error) ShowError(res, error);
                    User.UpdateName(user._id, req.form.name, function (error, newName) {
                        if (error) ShowError(res, error);
                        ShowError(res, newName);
                    });
                });
            }
        }
    });

    app.post('/users/UpdateEmail', forms.UpdateEmailForm, function (req, res) {
        if (req.session.user)/*Если человек не авторизован, то он не может сменить себе email*/
        {
            if (req.form.isValid) {
                User.findOne({ _id: req.session.user }, function (error, user) {
                    if (error) ShowError(res, error);
                    User.UpdateEmail(user._id, req.form.email, function (error, newEmail) {
                        if (error) ShowError(res, error);
                        var userId = user._id;

                        User.generateNewToken(userId, function (error, token) {
                            if (error) {
                                res.json({ errMsg: "Error on server can't generate new token for approve email address" })
                            }
                            if (token) {
                                approveUserMailSend(user, token, req.form.email);
                                res.json({ Msg: "Please confirm new email, we just send congirmation link, thanks" });
                            }
                        });
                    });
                });
            }
        }
    });


}
