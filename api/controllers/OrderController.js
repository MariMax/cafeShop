var Order = require('../models/Order.js').Order;
var Item = require('../models/Item.js').Item;
var Shop = require('../models/Shop.js').Shop;
var forms = require('../forms/PayForms.js');
var sendSMS = require('../models/CommonFunctions.js').sendSMS;
var sendMail = require('../models/CommonFunctions.js').sendMail;
var ru2en = require('../models/CommonFunctions.js').ru2en;
var User = require('../models/User.js').User;
var md5 = require('../models/CommonFunctions.js').md5;
var hashCalc = require('../models/CommonFunctions.js').hash;

exports.add_routes = function (app) {

    app.get("/api/order/:id", function (req, res) {
        Order.findOne({ _id: req.params.id }, function (err, value) {
            if (err)
                res.send(err, 404);
            else
                res.json(value, 200);
        });
    });

    app.get("/api/order/createOrder/:shopId/:itemId/:count", function (req, res) {
        var shopId = req.params.shopId;
        var itemId = req.params.itemId;
        var count = req.params.count;
        Shop.getShop(shopId, function (error, shop) {
            if (error) res.send(error, 404);
            else
                Item.getItem(itemId, function (error, item) {
                    if (error) res.send(error, 404);
                    else
                        Order.createOrder(shopId, itemId, count, item.Price, function (error, order) {
                            if (error)
                                res.send(error, 404);
                            else {
                                res.json(order, 200);
                            }
                        })

                })
        })
    });

    app.get("/api/order/setItem/:orderId/:shopId/:itemId/:count", function (req, res) {
        var orderId = req.params.orderId;
        var shopId = req.params.shopId;
        var itemId = req.params.itemId;
        var deliveryAddress = req.params.deliveryAddress;
        var count = req.params.count;
        Order.getOrder(orderId, function (error, order) {
            if (error) res.send(error, 404);
            else if (order._shop != shopId) res.send("Заказ не в том кафе", 404); else
                Shop.getShop(shopId, function (error, shop) {
                    if (error) res.send(error, 404);
                    else
                        Item.getItem(itemId, function (error, item) {

                            if (error || item._shop != shopId) res.send("Наверное блюдо не из этого кафе", 404);
                            else {
                                console.log("set order " + orderId + " " + itemId + " " + count)
                                Order.setOrderItems(orderId, itemId, count, item.Price, deliveryAddress, function (error, order) {
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

    app.get("/api/order/addItem/:orderId/:shopId/:itemId/:count", function (req, res) {
        var orderId = req.params.orderId;
        var shopId = req.params.shopId;
        var itemId = req.params.itemId;
        var count = req.params.count;
        Order.getOrder(orderId, function (error, order) {
            if (error) res.send(error, 404);
            else if (order._shop != shopId) res.send("Заказ не в том кафе", 404); else
                Shop.getShop(shopId, function (error, shop) {
                    if (error) res.send(error, 404);
                    else
                        Item.getItem(itemId, function (error, item) {
                            if (error || item._shop != shopId) res.send("Наверное блюдо не из этого кафе", 404);
                            else
                                console.log("set order " + orderId + " " + itemId + " " + count)
                            Order.addOrderItems(orderId, itemId, count, item.Price, function (error, order) {
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


    //  app.get("/api/order/calcPrice/:orderId", function (req, res) {
    //      var orderId = req.params.orderId;
    //      Order.calcOrderPrice(orderId, function (error, result) { if (error) res.send(error, 404); else res.json(result, 200) })
    //  });

    app.get("/api/order/delete/:orderId", function (req, res) {
        var orderId = req.params.orderId;
        Order.dropOrder(orderId, function (error, result) { if (error) res.send(error, 404); else res.json("Ok", 200) });
    });

    app.get("/api/order/deleteItem/:orderId/:itemId", function (req, res) {
        var orderId = req.params.orderId;
        var itemId = req.params.itemId;
        Order.deleteOrderItem(orderId, itemId, function (error, order) { if (error) res.send(error, 404); else res.json(order, 200) });
    });

    app.post("/api/order/pay", forms.OrderFinalForm, function (req, res) {
        var data = {};
        var orderId = '';
        if (req.form.isValid) {
            data = req.form;
            orderId = req.form.orderId;
            console.log("form valid orderId: " + orderId);
            Order.calcOrderPrice(orderId, function (error, order) {
                if (error) res.send(error, 404); else {
                    Order.setOrderInformation(order._id, data, order.Price, function (error, order) {
                        if (error) res.send(error, 404);
                        else {
                            res.send(order, 200);
                        }
                    })
                }
            });
        }
        else { res.send("Неверно заполнена форма", 404); }
    })

    function PayError(order) {
        sendMail(order.Email, conf.site_email, conf.site_name + ': Ошибка платежа', "По всем вопросам вы можете обратиться в службу поддержки http://idiesh.ru/contacts необходимо указать номер заказа " + order._id);
        if (order.UserPhone) {
            sendSMS(SMSconf, order.UserPhone, "Ошибка платежа, по всем вопросам вы можете обратиться в службу поддержки http://idiesh.ru/contacts номер заказа " + order._id, function (data, response) { console.log(data + " " + response) });
        }
    }

    function PaySystemAnswer(data, hash, callback) {
        var orderId = data.orderId//req.form.spUserDataOrderId;
        var messageText = '';
        var shopMessage = '';
        var shopSMSMessage = '';
        var smsMessage = '';
        var orderLink = conf.site_url + "/order/show/" + orderId;
        var clientPhone = "";
        var clientEmail = "";
        var orderItems = { itemIds: [], itemCount: [] };
        var myOrder = {};

        Order.approveOrder(orderId, data.BalanceAmount, data.Amount, data.paySystemHash, hash, function (error, order) {
            if (error) callback(error);
            else {
                localhash = hashCalc((Number(data.Amount)).toString(), conf.secret);
                if (data.Amount != order.Price || localhash != order.hash) {
                    PayError(order);
                    callback("Неверная сумма");
                }

                else {
                    myOrder = order;
                    //Рассылка sms продавцу, покупателю и 3 email
                    clientPhone = order.UserPhone;
                    clientEmail = order.Email;
                    for (var key in order.Items) {
                        if (order.Items[key].itemId) {
                            orderItems.itemIds.push(order.Items[key].itemId);
                            orderItems.itemCount.push(order.Items[key].count);
                        }
                    }
                    console.log(orderItems);
                    Item.getItems(orderItems.itemIds, function (error, items) {
                        if (error) callback(error); else {
                            console.log(items);
                            for (var key in items) {
                                var count = 0;
                                for (var key2 in orderItems.itemIds)
                                    if (orderItems.itemIds[key2].toString() == items[key]._id.toString()) {
                                        count = orderItems.itemCount[key2]; break;
                                    }
                                messageText += items[key].Name + ' ' + count + '; ';
                                shopMessage += items[key].Name + ' ' + count + '; ';
                            }
                            messageText += orderLink + ' ' + myOrder.Description;
                            shopMessage += orderLink + ' ' + myOrder.Description + ' оплачено: ' + myOrder.PaymentAmmount + ' клиент: ' + myOrder.UserName;
                            if (order.DeliveryAddress && order.DeliveryAddress.length > 0)
                                shopMessage += ' доставка: ' + order.DeliveryAddress;

                            //                        if (clientPhone) shopMessage += ' тел.: ' + clientPhone;
                            shopSMSMessage = ru2en.translite(shopMessage);

                            Shop.getShop(order._shop, function (error, shop) {
                                if (error) callback(error);
                                else {
                                    messageText += ' кафе: ' + shop.Name + ' ' + shop.WorkTime + ' ' + shop.Address + ' Приятного аппетита!'
                                    smsMessage = ru2en.translite(messageText);
                                    console.log(messageText);
                                    sendSMS(SMSconf, shop.CellPhone, shopSMSMessage, function (data, response) { console.log(data + " " + response) });
                                    if (clientPhone) {
                                        sendSMS(SMSconf, clientPhone, smsMessage, function (data, response) { console.log(data + " " + response) });
                                    }
                                    sendMail(clientEmail, conf.site_email, conf.site_name + ': Подтверждение платежа', messageText);
                                    sendMail("order@idiesh.ru", conf.site_email, conf.site_name + ': Заказ оплачен', shopMessage);
                                    User.getFirstApprovedUserInShop(shop._id, function (error, user) {
                                        if (user) {
                                            sendMail(user.email, conf.site_email, conf.site_name + ': Заказ оплачен', shopMessage);
                                            callback(null, "ok");
                                        } else callback(error);
                                    })

                                }
                            })
                        }
                    });

                }
            }
        })
    }

    app.post("/api/order/paySystemAnswer", forms.OrderAnswerForm, function (req, res) {
        //Оплата Ответ платежной системы spryPay
        var hash = '';
        console.log('ver 26/04');
        try {
            hash = md5(req.form.spPaymentId + req.form.spShopId + req.form.spShopPaymentId + req.form.spBalanceAmount + req.form.spAmount + req.form.spCurrency + req.form.spCustomerEmail + req.form.spPurpose + req.form.spPaymentSystemId + req.form.spPaymentSystemAmount + req.form.spPaymentSystemPaymentId + req.form.spEnrollDateTime + conf.sprySecret);
            if (hash != req.form.spHashString) {//Если не совпал хеш, то считаем что все плохо
                console.log("Hash error order Id " + req.form.spUserDataOrderId);
                Order.getOrder(req.form.spUserDataOrderId, function (error, order) {
                    if (error) { res.send("error"); return }
                    PayError(order);
                    res.send("error");
                    return;
                })
                res.send("error");
                return;
            }
        } catch (err)
        { console.log(err + ' wrong hash') }

        var data = {};
        data.BalanceAmount = req.form.spBalanceAmount;
        data.Amount = req.form.spAmount;
        data.paySystemHash = req.form.spHashString;
        data.orderId = req.form.spUserDataOrderId;

        PaySystemAnswer(data, hash, function (error, answer) {
            if (error) res.send("error"); else res.send(answer);
        })
    })

    app.post("/api/order/w1", forms.OrderW1AnswerForm, function (req, res) {
        //Оплата Ответ платежной системы
        var hash = '';
        console.log('ver w1 26/04');

        var data = {};
        data.BalanceAmount = req.form.spBalanceAmount;
        data.Amount = req.form.spAmount;
        data.paySystemHash = req.form.WMI_SIGNATURE;
        data.orderId = req.form.spUserDataOrderId;

        PaySystemAnswer(data, hash, function (error, answer) {
            if (error) res.send("WMI_RESULT=RETRY&WMI_DESCRIPTION=Сервер временно недоступен"); else res.send("WMI_RESULT=OK");
        })
    })

    app.post("/api/order/RBK", forms.OrderRBKAnswerForm, function (req, res) {
        //Оплата Ответ платежной системы RBK
        var hashstr = req.form.eshopId + '::' + req.form.orderId + '::' + req.form.serviceName + '::'+req.form.eshopAccount+'::' + req.form.recipientAmount + '::' + req.form.recipientCurrency + '::' + req.form.paymentStatus + '::' + req.form.userName + '::' + req.form.userEmail + '::' + req.form.paymentData + '::' + conf.rbkSecret;
        var hash = md5(hashstr);
        var data = {};
        data.BalanceAmount = req.form.recipientAmount;
        data.Amount = req.form.recipientAmount;
        data.paySystemHash = req.form.hash;
        data.orderId = req.form.orderId;
        if (req.form.paymentStatus == 5&&hash.toString()==req.form.hash.toString())
		{
            PaySystemAnswer(data, hash, function (error, answer) {
                if (error) res.send("Сервер временно недоступен"); else res.send("OK");
            });
		}
        else res.send("OK");
    })

    app.post("/api/order/RBKhash", forms.OrderRBKHashForm, function (req, res) {
        //Оплата Ответ платежной системы
        Order.getOrder(req.form.orderId, function (error, order) {
            if (error) { res.send("error"); return }
            var hashstr = req.form.eshopid + '::' + order.Price + ',00' + '::' + req.form.recipientCurrency + '::' + order.Email + '::' + req.form.serviceName + '::' + req.form.orderId + '::::' + conf.rbkSecret;
            var hash = md5(hashstr);
            res.send(hash);
            return;
        })
    })


}
