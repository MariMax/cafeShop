var models = require('../models/User.js');
var forms = require('../forms/UserForms.js');
var User = models.User;
var common = require('../models/CommonFunctions.js');
var sendMail = common.sendMail;


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

exports.add_routes = function (app) {

    app.post("/users/newUser", forms.SignupForm, function (req, res) {
        if (req.form.isValid) {
            console.log("right new User form");
            User.findOne({ email: req.form.email }, function (error, user) {
                if (user && user.approve) {
                    console.log(Date.now() + " user exists, try to remember password");
                    req.redirect('/home');
                }
                else if (user && !user.approve) {
                    //var token = null;
                    User.generateNewToken(user._id, function (error, token) {
                        if (error) {
                            console.log(Date.now() + "error in generate new token");
                            req.redirect('/home')
                        }
                        if (token) {
                            console.log(Date.now() + "new token is " + token);
                            //token = newToken;
                            approveUserMailSend(user, token);
                            console.log(Date.now() + "PLEASE approve, see your email");
                        }
                    });


                    //req.render('/home', { message: "PLEASE approve, see your email" });

                }
            });
            User.newUser(
                    req.form.email, req.form.password,
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
                                    console.log(Date.now() + "error in generate new token");
                                    req.redirect('/home')
                                }
                                if (token) {
                                    console.log(Date.now() + "new token is " + token);

                                    approveUserMailSend(user, token);
                                    console.log(Date.now() + "PLEASE approve, see your email");
                                }
                            });


                            //req.render('/home', { message: "PLEASE approve, see your email" });
                        } else {
                            // if (err.errors.email) {
                            //req.session.errors.push(err.errors.email.type);
                            console.log(Date.now() + 'Cant write email to db');
                            req.redirect('/home');
                            // }
                            //res.redirect('/');
                        }
                    });
        }
        else {
            console.log(Date.now() + "wrong new User form");
            console.log(Date.now() + " " + req.form.errors);
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
                    User.dropToken(userId, function (error, result) { if (result) console.log(Date.now() + ' token dropped ' + user.email); });
                    User.approve(userId, function (error, result) {
                        if (error) {
                            req.session.errors.push(
    							'Cant approve user');
                            console.log(Date.now() + ' Cant approve user ' + user.email);
                            res.render('pages/home',{message:"Cant approveUser some errors in db",title:""});
                        }
                        else {
                            console.log(Date.now() + ' User approved ' + user.email);
                            /*после подтверждения пользователя сохраняем его в сессию*/
                            req.session.regenerate(function () {
                                req.session.user = user._id;
                                //res.redirect('/home/');
                            });

                            res.render('pages/home', { message: 'User approved ' + user.email ,title:""});
                        }
                    });
                }
                else {
                    //req.session.errors.push('it is wrong link');
                    console.log(Date.now() + 'wrong link to approve user');
                    res.render('pages/home', { message: 'wrong link to approve user',title:'' });
                }
            });
        }
        else {
            req.session.errors.push(
    			'wrong link to approve user');
            console.log(Date.now() + 'wrong link to approve user');
            res.render('pages/home', { message: 'wrong link to approve user',title:'' });
        }
    });

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
								    } else {
								        console.log("Message sent: " + response.message);
                                        console.log("reset link: " + resetLink);
								    }

								    // if you don't want to use this transport object anymore, uncomment following line
								    //smtpTransport.close(); // shut down the connection pool, no more messages
								});

    		  //              req.session.messages.push(
								//'Email for user ' + user.email + ' was send');
    		                console.log(Date.now() + ' reset pass Email for user ' + user.email + ' was send');
    		                //res.render('/home', { message: 'reset pass Email for user ' + user.email + ' was send' });

    		            }
    		            else {
    		     //           req.session.errors.push(
    							//"Cant send email");
    		                console.log(Date.now() + 'reset pass Email for user ' + user.email + ' not send');
    		                //res.render('/home', { message: 'reset pass Email for user ' + user.email + ' not send' });
    		            }
    		        });
    		    }
    		    else {
    		        console.log(Date.now() + 'errors on reset pass form');
    		        console.log(Date.now() + " " + req.form.errors);

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
                            res.render('pages/home', {title:"",message:"Cant reset password"});
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

                                // if you don't want to use this transport object anymore, uncomment following line
                                //smtpTransport.close(); // shut down the connection pool, no more messages
                            });
                            res.render('pages/home', { message: "Your new password on your email "+password, title:"" });
                        }
                    });
                }
                else {
                    req.session.errors.push(
    					'it is wrong link');
                    console.log('wrong link to reset password');
                    res.render('pages/home',{message:'wrong link to reset password',title:''});
                }
            });
        }
        else {
       //     req.session.errors.push(
    			//'Este link expirou, a senha não pode ser resetada');
            res.render('pages/home',{message:'wrong link to reset password',title:''});
        }
    });

    app.get('users/logout', function (req, res) {
        req.session.destroy(function () {
            res.redirect('/home');
        });
    });

    app.post(
        'users/login', forms.SignupForm,
        function (req, res) {
            if (req.form.isValid) {
                console.log(Date.now() + ' valid login form');
                User.authenticate(
                    req.form.email, req.form.password,
                    function (err, user) {
                        if (user) {
                            console.log(Date.now() + ' user id '+user._id);
                            req.session.regenerate(function () {
                                req.session.user = user._id;
                                res.redirect(req.body.redir || 'users/home/');
                            });
                        } else {
                            console.log(Date.now() + ' cant find user or he does not approve');
                            if (!req.session.errors)
                                req.session.errors = [];

                            //req.session.errors.push(
                            //    'Autenticação falhou, verifique seu usuário e senha');
                            res.redirect('/home');
                        }
                    });
            } else {
                 console.log(Date.now() + ' INvalid login form');
                //req.session.errors = _.union(
                //    req.session.errors || [],
                //    req.form.errors);

                 res.redirect('/home');
            }

        }); 
}