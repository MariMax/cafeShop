exports.add_routes = function (app) {
    app.get("/users/newUser", function (req, res) { res.render("Users/RegisterUser"); });

    app.get("/users/forgot-password", function (req, res) { res.render("Users/ForgotPassword"); });

    app.get("/users/reset-password", function (req, res) { res.render("Users/ResetPassword", { userId: req.query.userId, verify: req.query.verify }); });

    app.get("/users/login", function (req, res) { res.render("Users/login"); });

    app.get('/users/logout', function (req, res) {
        req.session.destroy(function () {
            res.redirect('/');
        });
    });

    app.get('/users/approve-email', function (req, res) { res.render("Users/ApproveEmail", { email: req.query.email, token: req.query.verify, userId: req.query.userId }); });

    app.get("/users/update", function (req, res) { 
      if (req.session.user)
        {
            
    res.render("Users/update",{userId:req.session.user}); }
    else {res.redirect('users/login');}
    });
}