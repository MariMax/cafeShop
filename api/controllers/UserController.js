var models = require('../models/User.js');
var cafeModel = require('../models/Cafe.js');

var forms = require('../forms/UserForms.js');
var User = models.User;
var common = require('../models/CommonFunctions.js');
var sendMail = common.sendMail;

var approveuserInCafe = common.approveuserInCafe;
var assignUserandCafe = common.assignUserandCafe;
var logError = common.logError;
var ShowMessage = common.ShowMessage;




function approveUserMailSend(user, encodedToken, email,callback) {
    var approveLink = conf.site_url + "/users/approve-email/?userId=" + user._id + "&verify=" + encodedToken+"&email="+email;
    var approveMessage = "Hello, <br/>Click for approve your email in cofeShop System:<br/><a href=\"" + approveLink + "\">" + approveLink + "</a>";

    sendMail(user.email, conf.site_email, conf.site_name + ': approve email', approveMessage,
								function (error, response) {
								    if (error) {
								        console.log(Date.now() + " " + error);
								        console.log(Date.now() + 'Well done new User Added user email is ' + user.email + ' approve link ' + approveLink);
								        callback("Не удалось отправить email с подтверждением регистрации");
								    } else {
								        console.log(Date.now() + "Message sent: " + response.message);
								        console.log(Date.now() + 'Well done new User Added user email is ' + user.email + 'user id is ' + user._id + ' link ' + approveLink);
                                        callback(null,true)
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
                        approveUserMailSend(user, token, email, function (error, result) {
                            if (result)
                                callback(null, user); else callback(error);

                        });
                    }
            });



        } else {

            logError(Date.now() + 'Cant write email to db');
            if (err)
                logError(err);
            callback("Не удалось создать пользователя, попробуйте еще раз позже");

        }
    });
}

exports.add_routes = function (app) {



    app.post("/api/users/newUser", forms.SignupForm, function (req, res) {
        if (req.form.isValid) {
            if (req.form.password != req.form.passwordConfirm) ShowMessage(res, "пароль и его подтверждение не совпали", 500);
            else {
                /*Проверяем существует ли полностью подтвержденный пользователь*/
                User.findOne({ email: req.form.email }, function (error, user) {
                    if (user && user.approve) {
                        //logError(Date.now() + " user exists, try to remember password");
                        ShowMessage(res, "Пользователь с таким email уже зарегистрирован постарайтесь вспомнить пароль или <a href='/users/forgot-password'>восстановить его</a> ", 500);
                    }
                    else {
                        /*Проверяем существует ли пользователь который начал регистрацию*/
                        User.findOne({ tempemail: req.form.email }, function (error, userT) {
                            if (userT && !userT.approve) {
                                //var token = null;
                                User.generateNewToken(userT._id, function (error, token) {
                                    if (error) {
                                        logError("Error on server can't generate new token for approve email address");
                                        ShowMessage(res, "Ошибка подклчения к БД, попробуйте еще раз позже", 500)
                                    } else
                                        if (token) {
                                            approveUserMailSend(userT, token, req.form.email, function (error, result) {
                                                if (result) ShowMessage(res, "Пользователь уже зарегистрирован, но email не подтвержден, пожалуйста подтвердите его, ссылка на подтверждение отправлена на Ваш email", 200);
                                                else ShowMessage(res, "Пользователь уже зарегистрирован, но email не подтвержден, однако, не удалось отправить ссылку на подтверждение, попробуйте еще раз позже", 500);
                                            });
                                        }
                                });
                            } else {
                                if (userT && userT.approve) {
                                    User.dropToken(userT._id, function (error, dropTokenUser) {
                                        if (error) ShowMessage(res, error, 500); else
                                            newUser(req.form.email, req.form.password, req.form.UserName, function (error, user) {
                                                if (error) ShowMessage(res, error, 500); else
                                                    ShowMessage(res, "Пожалуйста подтвердите email, ссылка на подтверждение уже отправлена", 200);
                                            })
                                    });
                                }
                                else {
                                    newUser(req.form.email, req.form.password, req.form.UserName, function (error, user) {
                                        if (error) ShowMessage(res, error, 500); else
                                            ShowMessage(res, "Пожалуйста подтвердите email, ссылка на подтверждение уже отправлена", 200);
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }
        else {
            logError(Date.now() + "wrong new User form");
            logError(Date.now() + " " + req.form.errors);
            ShowMessage(res, "Форма регистрации заполнена неверно", 500)

        }
    });

    app.post('/api/users/approve-email', forms.ApproveEmailForm, function (req, res) {
        var userId = req.form.userId;
        var token = req.form.token;
        var email = req.form.email;
        if (userId && token && email) {
            /*Все сошлось все круто, но может получиться так что уже кто-то подтвердил такой email на другого пользователя, надо бы проверить*/
            User.findOne({ email: email }, function (error, approvedUser) {/*если у пользователя написано email то это значит что он подтвержден*/
                if (!approvedUser) {
                    User.findOne({ _id: userId, tempemail: email }, function (error, user) {
                        if (user && user.token == token) {
                            logError("We find User and token is right");

                            User.approveEmail(userId, email, function (error, result) {
                                if (error) {
                                    ShowMessage(res, "По каким-то причинам не удалось подтвердить email попробуйте позже", 500);
                                }
                                else {
                                    User.dropToken(userId, function (error, result) { if (result) console.log(Date.now() + ' token dropped ' + email); });
                                    req.session.regenerate(function () {
                                        console.log(Date.now() + ' User approved ' + result.email);
                                        /*после подтверждения пользователя сохраняем его в сессию*/
                                        req.session.user = userId;
                                        console.log("user approved " + userId)

                                        ShowMessage(res, 'Пользователь подтвержден ' + result.email, 200);
                                    });
                                }
                            });
                        }
                        else {
                            ShowMessage(res, 'Неверная ссылка на подтверждение email, попробуйте <a href="/users/newuser">еще раз</a>', 500);
                        }
                    });
                } else { ShowMessage(res, "Кто-то занял этот email раньше, попробуйте <a href='/users/newuser'>еще раз</a> с другим email адресом", 500); }
            });
        }
        else {
            ShowMessage(res, 'Неверная ссылка на подтверждение email, попробуйте <a href="/users/newuser">еще раз</a>', 500);
        }
    });




    app.post(
    		'/api/users/forgot-password', forms.ResetPasswordForm,
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
								        ShowMessage(res, "Не удалось отправить Email с восстановлением пароля", 500);
								    } else {
								        console.log("Message sent: " + response.message);
								        console.log("reset link: " + resetLink);
								        ShowMessage(res, "Информация по восстановлению пароля отправлена на ваш email", 200);
								    }
								});

    		            }
    		            else {
    		                ShowMessage(res, "Пользователь не зарегистрирован " + req.form.email, 500);
    		            }
    		        });
    		    }
    		    else {
    		        console.log(Date.now() + 'errors on reset pass form');
    		        console.log(Date.now() + " " + req.form.errors);
    		        ShowMessage(res, "Неверно заполнена форма, попробуйте указать email правильно", 500);

    		    }
    		});

    app.post('/api/users/reset-password', forms.ResetPasswordForm2, function (req, res) {
        var userId = req.form.userId;
        var verify = decodeURIComponent(req.form.verify);
        var password = '';
        if (userId && verify) {
            User.findOne({ _id: userId }, function (error, user) {
                if (user && user.password == verify) {
                    User.resetPassword(userId, function (error, result) {
                        if (error) {
                            console.log('Cant reset password');
                            ShowMessage(res, "Не удалось сбросить пароль", 500);
                        }
                        else {
                            password = result;
                            sendMail(user.email, conf.site_email, 'New password', password,
                            function (error, response) {
                                if (error) {
                                    console.log(error);
                                    console.log("new password " + password);
                                    ShowMessage(res, "Не удалось отправить сообщение с новым паролем <a href='/users/Forgot-Password'>Восстановить пароль еще раз</a>", 500);
                                } else {
                                    //console.log("Message sent: " + response.message);
                                    ShowMessage(res, "Новый пароль отправлен на ваш email", 200)
                                    //ShowMessage(res, "Your new password on your email " + password);
                                }
                            });

                        }
                    });
                }
                else {
                    ShowMessage(res, 'Неверная ссылка на сброс пароля <a href="/users/Forgot-Password">Восстановить пароль</a>', 500);
                }
            });
        }
        else {
            ShowMessage(res, 'Неверная ссылка на сброс пароля <a href="/users/Forgot-Password">Восстановить пароль</a>', 500);
        }
    });


    app.post('/api/users/login', forms.LoginForm, function (req, res) {
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
                                //res.redirect(req.body.redir || '/');
                                ShowMessage(res, 'Вход выполнен ' + user.email, 200);
                            });
                        } else {
                            console.log(Date.now() + ' cant find user or he does not approve');
                            if (!req.session.errors)
                                req.session.errors = [];
                            ShowMessage(res, "Не удалось найти пользователя или он не подтвержден", 500)
                        }
                    });
        } else {
            console.log(Date.now() + ' INvalid login form');
            ShowMessage(res, "Неверно заполнена форма входа", 500)
        }

    });

    //app.get("/users/assignwithcafe", function (req, res) { res.render("users/AssignWithCafe", { title: "AssignWithCafe" }); });

    app.post('/users/assignwithcafe', forms.AssignWithCafeForm, function (req, res) {
        if (req.session.user) {
            if (req.form.isValid) {
                assignUserandCafe(req.form.userId, req.form.cafeId, function (error, result) {
                    if (error) ShowMessage(res, error, 500); else
                        ShowMessage(res, result, 200);
                });
            } else { ShowMessage(res, "error in assign form", 500); }
        } else { ShowMessage(res, "Not autentificated", 500); }
    });

    //app.get("/users/approveuserincafe", function (req, res) { res.render("users/ApproveInCafe", { title: "ApproveInCafe" }); });

    app.post('/users/approveuserincafe', forms.AssignWithCafeForm, function (req, res) {
        if (req.session.user)/*если сотрудник кафе авторизован, то он сможет подтвердить что еще кто-то является сотрудником*/
        {
            if (req.form.isValid) {
                User.findOne({ _id: req.session.user }, function (error, user) {/*ищем сначала авторизованого юзера*/
                    if (error) ShowMessage(res, error, 500); else
                        if (user.approveInCurrentCafe && user._cafe && user._cafe == req.form.cafeId) {/*проеряем его принадлежность к нужному кафе*/
                            approveuserInCafe(req.form.userId, req.form.cafeId, function (error, result) {
                                if (error) ShowMessage(res, error, 500); else
                                    ShowMessage(res, result, 200);
                            })
                        } else
                        { ShowMessage(res, "authorized user from another cafe", 500) }
                });
            } else { ShowMessage(res, "error in approve form", 500); }
        }
        else { res.redirect('users/login'); }
    });


    app.post('/api/users/getcafe/:userId', function (req, res) {
        User.findOne({ _id: req.params.userId }).populate('_cafe').exec(function (error, user) {
            if (error) { ShowMessage(res, "Не удалось получить кафе пользователя", 500) } else
                if (user) {
                    var cafe = user._cafe;
                    if (cafe) {
                        cafe.CellPhoneVerificationCode = '';
                        res.json(cafe, 200);
                    } else res.json(404);
                }
        });
    });

    app.post('/api/users/getuser/:userId', function (req, res) {
        User.findOne({ _id: req.params.userId }, function (error, user) {
            if (error) ShowMessage(res, error, 500); else {
                var showUser = user;
                showUser.token = '';
                res.json(showUser, 200);

            }
        });
    });

    //app.get("/users/updateUserName", function (req, res) { res.render("users/updateUserName", { title: "updateUserName" }); });

    app.post('/api/users/updateUserName', forms.UpdateNameForm, function (req, res) {

        if (req.form.isValid) {
            User.findOne({ _id: req.session.user }, function (error, user) {
                if (error) ShowMessage(res, "Не удалось найти пользователя, попробуйте позже", 500); else
                    User.UpdateName(user._id, req.form.UserName, function (error, newName) {
                        if (error) ShowMessage(res, "Не удалось изменить имя пользователя", 500); else
                            ShowMessage(res, "Имя пользователя успешно изменено на " + newName, 200);
                    });
            });
        } else { ShowMessage(res, "Неверно заполнена форма изменения имени пользователя", 500); }

    });

    //app.get("/users/updateEmail", function (req, res) { res.render("users/UpdateEmail", { title: "UpdateEmail" }); });

    app.post('/api/users/UpdateEmail', forms.UpdateEmailForm, function (req, res) {

        if (req.form.isValid) {
            User.findOne({ _id: req.session.user }, function (error, user) {
                if (error) ShowMessage(res, error, 500); else

                    User.findOne({ email: req.form.email }, function (error, userE) {
                        if (userE) ShowMessage(res, "Данный email уже кем-то занят", 500); /*email уже занят*/
                        else/*Есть баг, надо искать не первого попавшегося юзера с таким email а всех, их может быть много, и всем сбрасывать*/
                            User.findOne({ tempemail: req.form.email }, function (error, userTmp) {
                                if (userTmp) {/*Кто-то уже хотел занять этот email, но еще не занял*/
                                    User.dropToken(userTmp._id, function (error, result) {/*если пользователь не подтверди ни одного email то мы его удалим */
                                        if (error) ShowMessage(res, error, 500); else
                                            User.UpdateEmail(user._id, req.form.email, function (error, newEmail) {
                                                if (error) ShowMessage(res, error, 500); else {
                                                    var userId = user._id;

                                                    User.generateNewToken(userId, function (error, token) {
                                                        if (error) ShowMessage(res, error, 500); else
                                                            if (token) {
                                                                approveUserMailSend(user, token, req.form.email, function (error, result) {
                                                                    if (result) ShowMessage(res, "Ссылка на подтверждение новоего email адреса отправлена", 200);
                                                                    else ShowMessage(res, "Не удалось отправить ссылку на подтверждение нового email адреса, попробуйте еще раз позже", 500);
                                                                });

                                                            }
                                                    });
                                                }
                                            });
                                    });
                                }
                                else {/*Пока никто не хотел его занять занимаем сами*/
                                    User.UpdateEmail(user._id, req.form.email, function (error, newEmail) {
                                        if (error) ShowMessage(res, error, 500); else {
                                            var userId = user._id;

                                            User.generateNewToken(userId, function (error, token) {
                                                if (error) ShowMessage(res, error, 500); else
                                                    if (token) {
                                                        approveUserMailSend(user, token, req.form.email, function (error, result) {
                                                            if (result) ShowMessage(res, "Ссылка на подтверждение новоего email адреса отправлена", 200);
                                                            else ShowMessage(res, "Не удалось отправить ссылку на подтверждение нового email адреса, попробуйте еще раз позже", 500);
                                                        });
                                                    }
                                            });
                                        }
                                    });
                                }
                            });
                    });
            });
        } else { ShowMessage(res, "Неверно заполнена форма смены email адреса", 500); }

    });

    //app.get("/users/updatePassword", function (req, res) { res.render("users/UpdatePassword", { title: "UpdatePassword" }); });

    app.post('/api/users/UpdatePassword', forms.UpdatePasswordForm, function (req, res) {

        if (req.form.isValid) {
            User.findOne({ _id: req.session.user }, function (error, user) {
                if (error) ShowMessage(res, "Не удалось найти пользователя", 500); else {
                    console.log(req.form.NewPassword);
                    console.log(req.form.PasswordConfirmation);
                    if (req.form.NewPassword == req.form.PasswordConfirmation) {
                        User.UpdatePassword(req.session.user, req.form.OldPassword, req.form.NewPassword, function (error, resUser) {
                            if (error) ShowMessage(res, "Не удалось изменить пароль, возможно старый пароль неверен", 500); else
                                if (resUser) ShowMessage(res, "Пароль успешно изменен", 200);
                        })
                    } else { ShowMessage(res, "Пароль и его подтверждение не совпали", 500); }
                }
            })
        } else { ShowMessage(res, "Неверно заполнена форма смены пароля", 500); }

    });
}
