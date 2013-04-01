exports.add_routes = function (app) {


    app.post("/order/buy", function (req, res) {
        if (req.session.user) {

            res.render("Cafes/admin", { cafeId: req.params.cafeId });

        } else { res.redirect('users/login'); }
    });
}