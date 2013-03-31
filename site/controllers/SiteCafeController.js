exports.add_routes = function (app) {
    app.get("/cafe/:cafeId/menu", function (req, res)
    { res.render("Cafes/menu", { cafeId: req.params.cafeId }); });

    app.get("/cafes/newCafe", function (req, res) {
        if (req.session.user) {
            res.render("Cafes/newCafe", { userId: req.session.user });
        }
        else res.redirect('users/login');
    });

    app.get("/cafe/:cafeId/admin", function (req, res) {
        if (req.session.user) {

            res.render("Cafes/admin", { cafeId: req.params.cafeId });

        } else { res.redirect('users/login'); }
    });
}