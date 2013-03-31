var Order = require('../models/Order.js').Order;
var Dish = require('../models/Dish.js').Dish;
var Cafe = require('../models/Cafe.js').Cafe;
var forms = require('../forms/PayForms.js');

exports.add_routes = function (app) {

    app.get("/api/order/:id", function (req, res) {
        Order.findOne({ _id: req.params.id }, function (err, value) {
            if (err)
                res.send(err, 404);
            else
                res.json(value, 200);
        });
    });

    app.get("/api/order/createOrder/:cafeId/:dishId/:count", function (req, res) {
        var cafeId = req.params.cafeId;
        var dishId = req.params.dishId;
        var count = req.params.count;
        Cafe.getCafe(cafeId, function (error, cafe) {
            if (error) res.send(error, 404);
            else
                Dish.getDish(dishId, function (error, dish) {
                    if (error) res.send(error, 404);
                    else
                        Order.createOrder(cafeId, dishId, count, function (error, order) {
                            if (error)
                                res.send(error, 404);
                            else {
                                res.json(order, 200);
                            }
                        })

                })
        })
    });

    app.get("/api/order/addDish/:orderId/:cafeId/:dishId/:count", function (req, res) {
        var orderId = req.params.orderId;
        var cafeId = req.params.cafeId;
        var dishId = req.params.dishId;
        var count = req.params.count;
        Order.getOrder(orderId, function (error, order) {
            if (error) res.send(error, 404);
            else if (order._cafe != cafeId) res.send("Заказ не в том кафе", 404); else
                Cafe.getCafe(cafeId, function (error, cafe) {
                    if (error) res.send(error, 404);
                    else
                        Dish.getDish(dishId, function (error, dish) {
                            if (error) res.send(error, 404);
                            else
                                Order.setOrderDishes(orderId, dishId, count, function (error, order) {
                                    if (error)
                                        res.send(error, 404);
                                    else {
                                        res.json(order, 200);
                                    }
                                })

                        })
                })
        })
    });


    app.get("/api/order/calcPrice/:orderId", function (req, res) {
        var orderId = req.params.orderId;
        Order.getOrder(orderId, function (error, order) {
            if (error) res.send(error, 404); else {
                var price = 0;
                for (var key in order.Dishes) {
                    var dishId = order.Dishes[key].dishId;
                    var count = order.Dishes[key].dishId;
                    Dish.getDish(dishId, function (error, dish) {
                        if (error) res.send(error, 404); else
                        { if (dish.Price) price += dish.Price * count }
                    })
                }
                var data = {};
                data.price = price;
                Order.setOrderInformation(orderId, data, function (error, order)
                { if (error) res.send(error, 404); else res.json(order, 200) });
            }
        })
    });

    app.get("/api/order/delete/:orderId", function (req, res) {
        var orderId = req.params.orderId;
        Order.dropOrder(orderId, function (error, result) { if (error) res.send(error, 404); else res.json(result, 200) });
    });

    app.get("/api/order/deleteDish/:orderId/:dishId", function (req, res) {
        var orderId = req.params.orderId;
        var dishId = req.params.dishId;
        Order.deleteOrderDish(orderId, dishId, function (error, order) { if (error) res.send(error, 404); else res.json(order, 200) });
    });

    app.post("/api/order/pay", forms.OrderFinalForm, function (req, res) {
        if (req.form.isValid) {
            var orderId = req.form.orderId;
            Order.setOrderInformation(orderId, req.form, function (error, order) {
                if (error) res.send(error, 404);
                else {
                    res.send("Ok", 200);
                }
            })
        }
        else { res.send("Неверно заполнена форма", 404); }
    })


    app.get("/api/order/paySystemAnswer/:orderId", function (req, res) {
        //Оплата Ответ платежной системы
        var orderId = req.params.orderId;
        Order.approveOrder(orderId, function (error, order) { 
        if (error) res.send(error,404);

        else {
            //Рассылка sms продавцу, покупателю и 3 email
            res.json(order,200);}})
    })


}
