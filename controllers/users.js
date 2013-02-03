/**
 * Created with JetBrains PhpStorm.
 * User: root
 * Date: 03.02.13
 * Time: 18:14
 * To change this template use File | Settings | File Templates.
 */

var models = require('../model/User.js');
var forms = require('../forms/users.js');
var User = models.User;

exports.add_routes = function (app) {
    app.get('/logout/', function(req, res){
        req.session.destroy(function(){
            res.redirect('/');
        });
    });

    app.post(
        '/login/', forms.LoginForm,
        function(req, res) {
            if (req.form.isValid) {
                User.authenticate(
                    req.form.email, req.form.password,
                    function (err, user) {
                        if (user) {
                            req.session.regenerate(function(){
                                req.session.user = user._id;
                                res.redirect(req.body.redir || '/home/');
                            });
                        } else {
                            if (!req.session.errors)
                                req.session.errors = [];

                            req.session.errors.push(
                                'Неверный логин или пароль');
                            res.redirect('back');
                        }
                    });
            } else {
                req.session.errors = _.union(
                    req.session.errors||[],
                    req.form.errors);

                res.redirect('back');
            }

        });

    app.post(
        '/signup/', forms.SignupForm,
        function(req, res) {
            if (req.form.isValid) {
                User.newUser(
                    req.form.email, req.form.password,
                    function (err, user) {
                        if ((user)&&(!err)) {
                            req.session.regenerate(function(){
                                req.session.user = user._id;
                                res.redirect('/home/');
                            });
                        } else {
                            if (err.errors.email) {
                                req.session.errors.push(
                                    err.errors.email.type);
                            }
                            res.redirect('back');
                        }
                    });

            } else {
                req.session.errors = _.union(
                    req.session.errors||[],
                    req.form.errors);
                res.redirect('back');
            }
        });


    app.get('/forgot-password', function(req, res) {
        res.render('users/forgot-password');
    });

    app.post(
        '/forgot-password', forms.ResetPasswdForm,
        function(req, res) {
            if (req.form.isValid) {
                User.findOne({email: req.form.email}, function (error, user) {
                    if (user && user.password) {
                        var oldPasswordHash = encodeURIComponent(user.password);
                        var userId = user._id;
                        var resetLink = conf.site_url+"/reset-password/?userId="+userId+"&verify="+oldPasswordHash;
                       /* var resetMessage = "Olá, <br/>Clique no link para resetar sua senha no PopBroker:<br/><a href=\""+resetLink+"\">"+resetLink+"</a>";
                        mail.message({
                            'MIME-Version': '1.0',
                            'Content-type': 'text/html;charset=UTF-8',
                            from: 'PopBroker Suporte <'+ conf.site_email + '>',
                            to: user.email,
                            subject: conf.site_name + ': resetar senha'
                        }).body(resetMessage)
                            .send(function(err) {
                                if (err) {
                                    req.session.errors.push(
                                        err.toString());
                                    res.redirect('back');
                                }
                            });

                        req.session.messages.push(
                            'E-mail enviado com sucesso. Go verifique sua inbox!');
                            */
                        res.redirect('back');
                    }
                    else {
                        req.session.errors.push(
                            "Пользователь с таким email не найден!");
                        res.redirect('back');
                    }
                });
            }
            else {
                req.session.errors = _.union(
                    req.session.errors||[],
                    req.form.errors);
                res.redirect('back');
            }
        });

    app.get('/reset-password', function(req, res, next) {
        var userId = req.query.userId;
        var verify = decodeURIComponent(req.query.verify);
        var password = '';
        if (userId && verify) {
            User.findOne({_id: userId}, function (error, user) {
                if (user && user.password == verify) {
                    User.resetPassword(userId, function (error, result) {
                        if (error) {
                            req.session.errors.push(
                                'Не удалось сбросить пароль');
                            res.render('users/reset-password');
                        }
                        else {
                            password = result;
                            res.render('users/reset-password', {password: password});
                        }
                    });
                }
                else {
                    req.session.errors.push(
                        'Неверные данные');
                    res.render('users/reset-password');
                }
            });
        }
        else {
            req.session.errors.push(
                'неверная ссылка');
            res.render('users/reset-password');
        }
    });
};