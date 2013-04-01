var Order = require('../models/Order.js').Order;
var Dish = require('../models/Dish.js').Dish;
var Cafe = require('../models/Cafe.js').Cafe;
var forms = require('../forms/PayForms.js');
var sendSMS = require('../models/CommonFunctions.js').sendSMS;
var sendMail = require('../models/CommonFunctions.js').sendMail;
var User = require('../models/User.js').User;

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
                        Order.createOrder(cafeId, dishId, count, dish.Price, function (error, order) {
                            if (error)
                                res.send(error, 404);
                            else {
                                res.json(order, 200);
                            }
                        })

                })
        })
    });

    app.get("/api/order/setDish/:orderId/:cafeId/:dishId/:count", function (req, res) {
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
                            if (error || dish._cafe != cafeId) res.send("Наверное блюдо не из этого кафе", 404);
                            else
                                console.log("set order " + orderId + " " + dishId + " " + count)
                            Order.setOrderDishes(orderId, dishId, count, dish.Price, function (error, order) {
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
                            if (error || dish._cafe != cafeId) res.send("Наверное блюдо не из этого кафе", 404);
                            else
                                console.log("set order " + orderId + " " + dishId + " " + count)
                            Order.addOrderDishes(orderId, dishId, count, dish.Price, function (error, order) {
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
        Order.calcOrderPrice(orderId, function (error, result) { if (error) res.send(error, 404); else res.json(result, 200) })
    });

    app.get("/api/order/delete/:orderId", function (req, res) {
        var orderId = req.params.orderId;
        Order.dropOrder(orderId, function (error, result) { if (error) res.send(error, 404); else res.json("Ok", 200) });
    });

    app.get("/api/order/deleteDish/:orderId/:dishId", function (req, res) {
        var orderId = req.params.orderId;
        var dishId = req.params.dishId;
        Order.deleteOrderDish(orderId, dishId, function (error, order) { if (error) res.send(error, 404); else res.json(order, 200) });
    });

    app.post("/api/order/pay", forms.OrderFinalForm, function (req, res) {
        console.log("order/pay");
        if (req.form.isValid) {

            var orderId = req.form.orderId;
            console.log("form valid orderId: " + orderId);
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
            if (error) res.send(error, 404);

            else {
                //Рассылка sms продавцу, покупателю и 3 email
                Cafe.getCafe(order._cafe, function (error, cafe) {
                    if (error) res.send(error, 404);
                    else {
                        var messageText = "Номер заказа: " + order._id;
                        for (var key in order.Dishes) {
                            var dishId = order.Dishes[key].dishId;
                            var count = order.Dishes[key].dishId;
                            Dish.getDish(dishId, function (error, dish) {
                                if (error) res.send(error, 404); else {
                                    messageText += dish.Name + " ";
                                    if (dish.Price) messageText += dish.Price + " ";
                                }
                            })
                        }

                        console.log(messageText+ " " + order.Description);
                        sendSMS(SMSconf, cafe.Phone, messageText + " " + order.Description);
                        sendSMS(SMSconf, order.UserPhone, messageText + " " + order.Description);
                        sendMail(order.Email, conf.site_email, conf.site_name + ': approve order', messageText + " " + order.Description);
                        sendMail("order@idiesh.ru", conf.site_email, conf.site_name + ': approve order', messageText + " " + order.Description);
                        User.getFirstApprovedUserInCafe(cafe._id, function (error, user) {
                            if (user)
                                sendMail(user.Email, conf.site_email, conf.site_name + ': approve order', messageText + " " + order.Description);
                        })
                    }
                })
                res.json(order, 200);
            }
        })
    })


}
