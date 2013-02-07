var models = require('../models/User.js');
var forms = require('../forms/UserForms.js');
var User = models.User;



exports.add_routes = function (app) {
    
    app.post("/users/newUser",forms.SignupForm, function (req, res) {
        if (req.form.isValid)
        {
            console.log("right form")
        }
        else {console.log("wrong form")}
    })

    app.get("/about", function (req, res) {
        res.render('pages/about', {
            title: 'about'
    , message: 'This is the "about" action of "pages" controller'
        })
    } )
}