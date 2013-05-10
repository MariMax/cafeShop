exports.add_routes = function (app) {
    app.get("/shop/:shopId/stock", function (req, res)
    { res.render("Shops/stock", { shopId: req.params.shopId }); });

    app.get("/shops/newShop", function (req, res) {
        if (req.session.user) {
            res.render("Shops/newShop", { userId: req.session.user });
        }
        else res.redirect('users/login');
    });

    app.get("/shop/:shopId/admin", function (req, res) {
        if (req.session.user) {

            res.cookie('shopId', req.params.shopId, { expires: new Date(Date.now() + 900000), httpOnly: false });
            res.render("Shops/admin", { shopId: req.params.shopId });

        } else { res.redirect('users/login'); }
    });
}