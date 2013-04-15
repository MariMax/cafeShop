exports.add_routes = function (app) {
    app.get("/", function (req, res) {
        console.log(req.session.user);
        res.render("Common/index", { userId: req.session.user });
    });

    app.get("/contacts", function (req, res) {
        res.render("Common/Contacts");
    });
}