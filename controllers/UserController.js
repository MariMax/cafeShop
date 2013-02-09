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
								        console.log(Date.now+" "+error);
								    } else {
								        console.log(Date.now+"Message sent: " + response.message);
								    }

								    // if you don't want to use this transport object anymore, uncomment following line
								    //smtpTransport.close(); // shut down the connection pool, no more messages
								});

                            console.log(Date.now+'Well done new User Added user email is ' + user.email + 'user id is ' + user._id+' link '+approveLink);
}

exports.add_routes = function (app) {

    app.post("/users/newUser", forms.SignupForm, function (req, res) {
        if (req.form.isValid) {
            console.log("right new User form");
            User.findOne({ email: req.form.email }, function (error, user) {
                if (user && user.approve) {
                    console.log(Date.now + "user exists, try to remember password");
                    //req.render('/home', { message: "user exists, try to remember password" });
                }
                else if (user && !user.approve) {
                    var token = {};
                    User.generateNewToken(user._id, function (error, newToken) {
                        if (error) {
                            console.log(Date.now + "error in generate new token");
                            //req.render('/home', { message: "user exists, try to remember password" })
                        }
                        if (newToken) {
                            console.log(Date.now + "new token is " + newToken);
                            token = newToken;
                        }
                    });
                    token = encodeURIComponent(token);
                    approveUserMailSend(user, token);
                    console.log(Date.now + "PLEASE approve, see your email");
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
                            var token = {};
                            User.generateNewToken(userId, function (error, newToken) {
                                if (error) {
                                    console.log(Date.now + "error in generate new token");
                                    //req.render('/home', { message: "error in generate new token" })
                                }
                                if (newToken) {
                                    console.log(Date.now + "new token is " + newToken);
                                    token = newToken;
                                }
                            });
                            token = encodeURIComponent(token);
                            approveUserMailSend(user, token);
                            console.log(Date.now + "PLEASE approve, see your email");
                            //req.render('/home', { message: "PLEASE approve, see your email" });
                        } else {
                            if (err.errors.email) {
                                //req.session.errors.push(err.errors.email.type);
                                console.log(Date.now + 'Error mail type on new User Form');
                                //req.render('/home', { message: "Error mail type on new User Form" });
                            }
                            //res.redirect('/');
                        }
                    });
        }
        else {
            console.log(Date.now + "wrong new User form");
            console.log(Date.now + " " + req.form.errors);
            //req.render('/home', { message: "wrong new User form" });
            //req.session.errors = _.union(req.session.errors || [],
            //      req.form.errors);
            //res.redirect('back');
        }
    });

    app.get('/users/approve-email', function (req, res, next) {
        var userId = req.query.userId;
        var token = decodeURIComponent(req.query.verify);

        if (userId && token) {
            User.findOne({ _id: userId }, function (error, user) {
                if (user && user.token == token) {
                    User.approve(userId, function (error, result) {
                        if (error) {
                            req.session.errors.push(
    							'Cant approve user');
                            console.log(Date.now + ' Cant approve user ' + user.email);
                            res.render('/home');
                        }
                        else {
                            console.log(Date.now + ' User approved ' + user.email);
                            res.render('/home', { message: 'User approved ' + user.email });
                        }
                    });
                }
                else {
                    //req.session.errors.push('it is wrong link');
                    console.log(Date.now + 'wrong link to approve user');
                    res.render('/home', { message: 'wrong link to approve user' });
                }
            });
        }
        else {
            req.session.errors.push(
    			'wrong link to approve user');
            console.log(Date.now + 'wrong link to approve user');
            res.render('/home', { message: 'wrong link to approve user' });
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
								    }

								    // if you don't want to use this transport object anymore, uncomment following line
								    //smtpTransport.close(); // shut down the connection pool, no more messages
								});

    		                req.session.messages.push(
								'Email for user ' + user.email + ' was send');
    		                console.log(Date.now + 'reset pass Email for user ' + user.email + ' was send');
    		                //res.render('/home', { message: 'reset pass Email for user ' + user.email + ' was send' });

    		            }
    		            else {
    		                req.session.errors.push(
    							"Cant send email");
    		                console.log(Date.now + 'reset pass Email for user ' + user.email + ' not send');
    		                //res.render('/home', { message: 'reset pass Email for user ' + user.email + ' not send' });
    		            }
    		        });
    		    }
    		    else {
    		        console.log(Date.now + 'errors on reset pass form');
    		        console.log(Date.now+" "+req.form.errors);

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
                            res.render('/home');
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
                            res.render('/home', { message: "Your new password on your email" });
                        }
                    });
                }
                else {
                    req.session.errors.push(
    					'it is wrong link');
                    console.log('wrong link to reset password');
                    res.render('users/reset-password');
                }
            });
        }
        else {
            req.session.errors.push(
    			'Este link expirou, a senha não pode ser resetada');
            res.render('users/reset-password');
        }
    });

}