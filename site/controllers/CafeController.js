exports.add_routes = function (app) {
    app.get("/cafe/:cafeId/menu", function (req, res)
    { res.render("cafes/menu", { cafeId: req.params.cafeId }); });
}