exports.add_routes = function (app) {
    app.get("/order/buy/:orderId", function (req, res) {
            res.render("Order/order", {orderId: req.params.orderId});
    });
}