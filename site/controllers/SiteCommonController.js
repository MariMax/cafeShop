exports.add_routes = function (app) {
    app.get("/", function (req, res) {
        console.log(req.session.user);
        res.render("common/index", { userId: req.session.user });
    });
}