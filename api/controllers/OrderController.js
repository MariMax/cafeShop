var Order = require('../models/Order.js').Order;
var Dish = require('../models/Dish.js').Dish;
var Cafe = require('../models/Cafe.js').Cafe;
var forms = require('../forms/PayForms.js');
var sendSMS = require('../models/CommonFunctions.js').sendSMS;
var sendMail = require('../models/CommonFunctions.js').sendMail;
var ru2en = require('../models/CommonFunctions.js').ru2en;
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
                            else {
                                console.log("set order " + orderId + " " + dishId + " " + count)
                                Order.setOrderDishes(orderId, dishId, count, dish.Price, function (error, order) {
                                    if (error)
                                        res.send(error, 404);
                                    else {
                                        res.json(order, 200);
                                    }
                                })
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
                    res.send(order, 200);
                }
            })
        }
        else { res.send("Неверно заполнена форма", 404); }
    })


    app.post("/api/order/paySystemAnswer", forms.OrderAnswerForm, function (req, res) {
        //Оплата Ответ платежной системы
        var orderId = req.form.spUserDataOrderId;
        var messageText = 'Ваш заказ: ';
        var cafeMessage = 'Вам заказ: '
        var cafeSMSMessage = ''
        var smsMessage = '';
        var orderLink = conf.site_url + "/order/show/" + orderId;
        var clientPhone = "";
        var clientEmail = "";
        var orderDishes = { dishIds: [], dishCount: [] };
        var myOrder = {};
        console.log(orderDishes);
        Order.approveOrder(orderId, function (error, order) {
            if (error) res.send("error", 404);

            else {
                myOrder = order;
                //Рассылка sms продавцу, покупателю и 3 email
                clientPhone = order.UserPhone;
                clientEmail = order.Email;
                for (var key in order.Dishes) {
                    if (order.Dishes[key].dishId) {
                        orderDishes.dishIds.push(order.Dishes[key].dishId);
                        orderDishes.dishCount.push(order.Dishes[key].count);
                    }
                }
                console.log(orderDishes);
                Dish.getDishes(orderDishes.dishIds, function (error, dishes) {
                    if (error) res.send("error " + error, 404); else {
                        console.log(dishes);
                        for (var key in dishes) {
                            var count = 0;
                            for (var key2 in orderDishes.dishIds)
                                if (orderDishes.dishIds[key2].toString() == dishes[key]._id.toString()) {
                                    count = orderDishes.dishCount[key2]; break;
                                }
                            messageText += dishes[key].Name + ' ' + count + '; ';
                            cafeMessage += dishes[key].Name + ' ' + count + '; ';
                        }
                        messageText += orderLink+' ' +myOrder.Description+' Приятного аппетита!';
                        cafeMessage += orderLink+' '+myOrder.Description;
                        smsMessage = ru2en.translite(messageText);
                        cafeSMSMessage = ru2en.translite(cafeMessage);
                        console.log(messageText);
                        Cafe.getCafe(order._cafe, function (error, cafe) {
                            if (error) res.send("error " + error, 404);
                            else {
                                sendSMS(SMSconf, cafe.CellPhone, cafeSMSMessage, function (data, response) { console.log(data + " " + response) });
                                if (clientPhone) {
                                    sendSMS(SMSconf, clientPhone, smsMessage, function (data, response) { console.log(data + " " + response) });
                                }
                                sendMail(clientEmail, conf.site_email, conf.site_name + ': approve order', messageText);
                                sendMail("order@idiesh.ru", conf.site_email, conf.site_name + ': approve order', cafeMessage);
                                User.getFirstApprovedUserInCafe(cafe._id, function (error, user) {
                                    if (user) {
                                        sendMail(user.email, conf.site_email, conf.site_name + ': approve order', cafeMessage);
                                        res.json("ok " + myOrder, 200);
                                    } else res.send("error " + error, 404);
                                })

                            }
                        })
                    }
                });

            }
        })
    })
    //Для тестов
    //app.get("/api/order/paySystemAnswer/:orderId", function (req, res) {
    //    //Оплата Ответ платежной системы
    //    var orderId = req.params.orderId;
    //    var messageText = 'Ваш заказ: ';
    //    var cafeMessage = 'Вам заказ: '
    //    var cafeSMSMessage = ''
    //    var smsMessage = '';
    //    var orderLink = conf.site_url + "/order/show/" + orderId;
    //    var clientPhone = "";
    //    var clientEmail = "";
    //    var orderDishes = { dishIds: [], dishCount: [] };
    //    var myOrder = {};
    //    console.log(orderDishes);
    //    Order.approveOrder(orderId, function (error, order) {
    //        if (error) res.send("error", 404);

    //        else {
    //            myOrder = order;
    //            //Рассылка sms продавцу, покупателю и 3 email
    //            clientPhone = order.UserPhone;
    //            clientEmail = order.Email;
    //            for (var key in order.Dishes) {
    //                if (order.Dishes[key].dishId) {
    //                    orderDishes.dishIds.push(order.Dishes[key].dishId);
    //                    orderDishes.dishCount.push(order.Dishes[key].count);
    //                }
    //            }
    //            console.log(orderDishes);
    //            Dish.getDishes(orderDishes.dishIds, function (error, dishes) {
    //                if (error) res.send("error " + error, 404); else {
    //                    console.log(dishes);
    //                    for (var key in dishes) {
    //                        var count = 0;
    //                        for (var key2 in orderDishes.dishIds)
    //                            if (orderDishes.dishIds[key2].toString() == dishes[key]._id.toString()) {
    //                                count = orderDishes.dishCount[key2]; break;
    //                            }
    //                        messageText += dishes[key].Name + ' ' + count + '; ';
    //                        cafeMessage += dishes[key].Name + ' ' + count + '; ';
    //                    }
    //                    messageText += orderLink+' ' +myOrder.Description+' Приятного аппетита!';
    //                    cafeMessage += orderLink+' '+myOrder.Description;
    //                    smsMessage = ru2en.translite(messageText);
    //                    cafeSMSMessage = ru2en.translite(cafeMessage);
    //                    console.log(messageText);
    //                    Cafe.getCafe(order._cafe, function (error, cafe) {
    //                        if (error) res.send("error " + error, 404);
    //                        else {
    //                            sendSMS(SMSconf, cafe.CellPhone, cafeSMSMessage, function (data, response) { console.log(data + " " + response) });
    //                            if (clientPhone) {
    //                                sendSMS(SMSconf, clientPhone, smsMessage, function (data, response) { console.log(data + " " + response) });
    //                            }
    //                            sendMail(clientEmail, conf.site_email, conf.site_name + ': approve order', messageText);
    //                            sendMail("order@idiesh.ru", conf.site_email, conf.site_name + ': approve order', cafeMessage);
    //                            User.getFirstApprovedUserInCafe(cafe._id, function (error, user) {
    //                                if (user) {
    //                                    sendMail(user.email, conf.site_email, conf.site_name + ': approve order', cafeMessage);
    //                                    res.json("ok " + myOrder, 200);
    //                                } else res.send("error " + error, 404);
    //                            })

    //                        }
    //                    })
    //                }
    //            });

    //        }
    //    })
    //})


}
