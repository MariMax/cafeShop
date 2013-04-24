exports.add_routes = function (app) {
    app.get("/order/buy/:orderId", function (req, res) {
        res.render("Order/order", { orderId: req.params.orderId });
    });

    app.get("/order/show/:orderId", function (req, res) {
        res.render("Order/ShowPaidOrder", { orderId: req.params.orderId });
    });

    app.get("/order/success/:i", function (req, res) {
        res.render("Order/Success");
    });
    app.get("/order/fail/:i", function (req, res) {
        res.render("Order/Fail");
    });
    app.post("/order/success/:i", function (req, res) {
        res.render("Order/Success");
    });
    app.post("/order/fail/:i", function (req, res) {
        res.render("Order/Fail");
    });
}