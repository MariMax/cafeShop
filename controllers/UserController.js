var models = require('../models/User.js');
var forms = require('../forms/UserForms.js');
var User = models.User;
var common = require('../models/CommonFunctions.js');
var sendMail = common.sendMail;
var cafeModel = require('../models/Cafe.js');


function approveUserMailSend(user,encodedToken)
{
                               var approveLink = conf.site_url + "/users/approve-email/?userId=" + user._id + "&verify=" + encodedToken;
                            var approveMessage = "Hello, <br/>Click for approve your email in cofeShop System:<br/><a href=\"" + approveLink + "\">" + approveLink + "</a>";

                            sendMail(user.email, conf.site_email, conf.site_name + ': approve email', approveMessage,
								function (error, response) {
								    if (error) {
								        console.log(Date.now()+" "+error);
								    } else {
								        console.log(Date.now()+"Message sent: " + response.message);
								    }

								    // if you don't want to use this transport object anymore, uncomment following line
								    //smtpTransport.close(); // shut down the connection pool, no more messages
								});

                            console.log(Date.now()+'Well done new User Added user email is ' + user.email + 'user id is ' + user._id+' link '+approveLink);
}

function CafeForNewUser(user, callback)
{
    var cafeData = {},
    userId = user._id;
    cafeData.Name = user.UserName;
    cafeModel.newCafe(cafeData,
                        function (cafe) {
                            logError("We Create cafe id = "+cafe._id)
                            User.assignWithCafe(cafe._id, userId,
                                            function (error, value) {
                                                if (error) {

                                                    return callback(Date.now() + " cant assign user " + user.email + " with cafe " + cafe._id + " error " + error);
                                                } else {
                                                    logError("Assign user and cafe")
                                                    User.approveInCafe(cafe._id, userId,
                                                            function (error, value) {
                                                                if (error) {
                                                                    return callback(Date.now() + " cant approve user " + user.email + " in cafe " + cafe._id + " error " + error);
                                                                }
                                                                logError("Approve user in cafe")
                                                                return callback(null, cafe);
                                                            });
                                                }
                                            });
                        },
                        function (error) {
                            return callback((Date.now() + " cant create cafe error " + error));
                        });
 }

 function logError(error){
     if (error) {
         console.log(error);
     }
 }
 function ShowError(response, error) {
     if (error) {
         logError(error);
         response.json({ message: error});
     }
 }

 exports.add_routes = function (app) {

     app.get("/users/newUser", function (req, res) { res.render("users/RegisterUser", { title: "newuser" }); });

     app.post("/users/newUser", forms.SignupForm, function (req, res) {
         if (req.form.isValid) {
             User.findOne({ email: req.form.email }, function (error, user) {
                 if (user && user.approve) {
                     //logError(Date.now() + " user exists, try to remember password");
                     res.json({ errMsg: "User Exists try to remember password" });
                 }
                 else if (user && !user.approve) {
                     //var token = null;
                     User.generateNewToken(user._id, function (error, token) {
                         if (error) {
                             res.json({ errMsg: "Error on server can't generate new token for approve email address" })
                         }
                         if (token) {
                             approveUserMailSend(user, token);
                             res.json({ Msg: "User Exists but email does not confirm, please confirm it, we just send congirmation link, thanks" });
                         }
                     });
                 }
             });
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
                                    approveUserMailSend(user, token);
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

         if (userId && token) {
             User.findOne({ _id: userId }, function (error, user) {
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

     app.get('users/assignwithcafe', function (req, res) {
         if (!req.session || !req.session.user) res.redirect('users/login');
         /*Надо создать кафешку этому пользователю если её еще нет*/
         if (user._cafe == null) {
             logError("User whithout cafe");
             CafeForNewUser(user, ShowError(res, error));
         }
         /*Если кафе есть, т.е. его пригласил реальный сотрудник, то подтверждаем его в кафе*/
         else {
             User.approveInCafe(user._cafe, userId,
                                                            function (error, value) {
                                                                if (error) {
                                                                    ShowError(res, Date.now() + " cant approve user " + user.email + " in cafe " + user._cafe + " error " + error);
                                                                }
                                                            });
         }
     })
 }