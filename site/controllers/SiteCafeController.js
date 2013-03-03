exports.add_routes = function (app) {
    app.get("/cafe/:cafeId/menu", function (req, res)
    { res.render("cafes/menu", { cafeId: req.params.cafeId }); });

    app.get("/cafes/newCafe", function (req, res) { 
    if (req.session.user){
    res.render("cafes/newCafe", {userId:req.session.user}); }
    else res.redirect('user/login');});

    app.get("/cafes/updateValues/:cafeId", function (req, res) {
        if (req.session.user) {

                    res.render("cafes/admin", { cafeId: req.params.cafeId });

        } else { res.redirect('users/login'); }
    });
}