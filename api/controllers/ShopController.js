var models = require('../models/Shop.js');
var forms = require('../forms/ShopForms.js');
var User = require('../models/User.js').User;
var Stock = require('../models/Stock.js').Stock;
var common = require('../models/CommonFunctions.js');
//var gm = require('gm');
var sendMail = common.sendMail;
var sendSMS = common.sendSMS;

var approveuserInShop = common.approveuserInShop;
var assignUserandShop = common.assignUserandShop;
var logError = common.logError;
var ShowMessage = common.ShowMessage;



exports.add_routes = function (app) {

    app.post('/api/shops/newShop', forms.createShopForm, function (req, res) {

        if (req.form.isValid) {
            User.findOne({ _id: req.form.userId }, function (error, user) {
                if (error) ShowMessage(res, "Не удалось найти пользователя, под которым вы зашли", 500);
                else {
                    if (user._shop!=null) ShowMessage(res, "Данный пользователь уже зарегистрирован в кафе", 500);
                    else{
                    Shop.findOne({ CellPhone: req.form.cellPhone }, function (error, shopWithApprovedCellPhone) {
                        if (!shopWithApprovedCellPhone) {
                            Shop.newShop(req.form, function (error, shop) {

                                if (error) ShowMessage(res, "Не удалось создать кафе, попробуйте еще раз позже", 500); else {
                                    console.log(shop);
                                    Stock.newStock(shop._id, { Name: "NewStock", Description: "NewDescription" }, function (error, stock) {
                                        if (error) ShowMessage(res, "Не удалось создать еню в кафе", 500);
                                    });
                                    assignUserandShop(user._id, shop._id, function (error, userAssigned) {
                                        if (error) ShowMessage(res, "Не удалось связать пользователя и кафе", 500); else {
                                            console.log(userAssigned)
                                            approveuserInShop(userAssigned, shop, function (error, val) {
                                                if (error) ShowMessage(res, "Не удалось подтвердить пользователя в кафе", 500); else {
                                                    sendSMS(SMSconf, shop.tempCellPhone, shop.CellPhoneVerificationCode, function (data, response) {
                                                        logError("CellPhoneApprovelink " + conf.site_url + "/api/shops/approve-CellPhone?shopId=" + shop._id.toString() + "&token=" + shop.CellPhoneVerificationCode + "&cellPhone=" + encodeURIComponent(shop.tempCellPhone));
                                                        ShowMessage(res, { message: "Вам отправлено SMS сообщение с кодом подтверждения телефона", shopId: shop._id }, 200);
                                                    });
                                                }
                                            })
                                        }
                                    });
                                    Category.newCategory(shop._id, 1, "zavtraki", "Завтраки", function (data) { }, function (error) {
                                        logError("Category.newCategory " + error);
                                    });
                                    Category.newCategory(shop._id, 2, "goryachie", "Горячие блюда", function (data) { }, function (error) {
                                        logError("Category.newCategory " + error);
                                    });
                                    Category.newCategory(shop._id, 3, "salat", "Салаты", function (data) { }, function (error) {
                                        logError("Category.newCategory " + error);
                                    });
                                    Category.newCategory(shop._id, 4, "sup", "Супы", function (data) { }, function (error) {
                                        logError("Category.newCategory " + error);
                                    });
                                    Category.newCategory(shop._id, 5, "garnir", "Гарниры", function (data) { }, function (error) {
                                        logError("Category.newCategory " + error);
                                    });
                                    Category.newCategory(shop._id, 6, "desert", "Десерт", function (data) { }, function (error) {
                                        logError("Category.newCategory " + error);
                                    });
                                    Category.newCategory(shop._id, 7, "drink", "Напитки", function (data) { }, function (error) {
                                        logError("Category.newCategory " + error);
                                    });
                                }
                            });
                        } else {
                            ShowMessage(res, "Этот номер телефона уже зарегистрирован за другим кафе, пожалуйста введите новый номер", 500)
                        }
                    });
                }
            }});
        } else { ShowMessage(res, 'Неверно заполнена форма регистрации нового кафе', 500); }

    });

    app.post("/api/shops/getApprovedUsers/:shopId", function (req, res) {
        User.getAllApprovedUsersInShop(req.params.shopId, function (error, users) {
            if (error) res.json(null, 200);
            else res.json(users, 200);
        });
    });

    app.post("/api/shops/getAllUsers/:shopId", function (req, res) {
        User.getAllUsersInShop(req.params.shopId, function (error, users) {
            if (error) res.json(null, 200);
            else res.json(users, 200);
        });
    });

    app.get("/api/shops/:shopId", function (req, res) {
        Shop.findOne({ _id: req.params.shopId }, function (error, shop) {
            if (error) res.json(null, 404); else {
                console.log(shop);
                shop.CellPhoneVerificationCode = '';

                res.json(shop, 200);
            }
        });
    });

    app.get("/api/shops/all/:i", function (req, res) {
        Shop.find({ CanWorkInShopShop: true, Longitude: { $ne: null }, Latitude: { $ne: null} }, function (error, shops) {
            if (error) res.json(null, 404); else {
                res.json(shops, 200);
            }
        });
    });

    app.get("/api/shops/allinPalce/:longitude/:latitude", function (req, res) {
        Shop.find({ CanWorkInShopShop: true, Longitude: req.params.longitude, Latitude: req.params.latitude }, function (error, shops) {
            if (error) res.json(null, 404); else {
                res.json(shops, 200);
            }
        });
    });

    app.post("/api/shops/updateValues", forms.updateShopForm, function (req, res) {

        if (req.form.isValid) {
            User.findOne({ _id: req.session.user }, function (error, user) {
                if (error) ShowMessage(res, "Не удалось найти пользователя", 500);
                else {
                    logError(user.approve);
                    logError(user.approveInCurrentShop);
                    logError(user._shop);
                    logError(req.form.shopId);
                    logError(req.form);
                    if (user.approve && user.approveInCurrentShop && user._shop && user._shop == req.form.shopId)
                        Shop.UpdateShopValue(req.form.shopId, req.form, function (error, shop) {
                            if (error) ShowMessage(res, 'Не удалось обновить данные', 500);
                            else ShowMessage(res, 'Данные успешно обновлены', 200);
                        });
                    else { ShowMessage(res, 'Пользователь не из этого кафе', 500); }
                }
            });
        } else { ShowMessage(res, 'Неверно заполнены параметры формы', 500); }

    })

    app.post("/api/shops/updateCellPhone", forms.UpdateShopCellPhoneForm, function (req, res) {
        if (req.form.isValid) {
            User.findOne({ _id: req.session.user }, function (error, user) {
                if (error) ShowMessage(res, "Не удалось найти пользователя", 500);
                else {
                    if (user.approve && user.approveInCurrentShop && user._shop && user._shop == req.form.shopId)
                        Shop.findOne({ CellPhone: req.form.cellPhone }, function (error, approvedShop) {
                            if (!approvedShop) {
                                logError(req.form.shopId);
                                logError(req.form.cellPhone);
                                Shop.UpdateCellPhone(req.form.shopId, req.form.cellPhone, function (error, shop) {
                                    if (error) ShowMessage(res, "Не удалось обновить номер телефона", 500);
                                    else {
                                        sendSMS(SMSconf, shop.tempCellPhone, shop.CellPhoneVerificationCode, function (data, response) {
                                            logError("CellPhoneApprovelink " + conf.site_url + "/api/shops/approve-CellPhone?shopId=" + shop._id.toString() + "&token=" + shop.CellPhoneVerificationCode + "&cellPhone=" + encodeURIComponent(shop.tempCellPhone));
                                            ShowMessage(res, "На Ваш номер отправлена SMS с кодом подтверждения", 200);
                                        })
                                    }
                                });
                            } else { ShowMessage(res, "Данный номер телефона уже зарегистрирован, используйте другой номер", 500); }
                        });
                }
            });

        } else { ShowMessage(res, 'Неверно заполнена форма изменения номера телефона', 500); }
    });

    app.post('/api/shops/approve-CellPhone', forms.ConfirmShopCellPhoneForm, function (req, res, next) {
        //logError("hello");
        if (req.form.isValid) {
            //logError("approve cellPhoneForm Valid");
            var shopId = req.form.shopId;
            var token = req.form.token;
            var cellPhone = req.form.cellPhone;
            //logError(shopId);
            //logError(token);
            //logError(cellPhone);
            Shop.findOne({ CellPhone: cellPhone }, function (error, shopApprovedCellPhone) {
                if (!shopApprovedCellPhone) {
                    Shop.findOne({ _id: shopId, tempCellPhone: cellPhone.toString(), CellPhoneVerificationCode: token }, function (error, shop) {
                        if (shop && shop.CellPhoneVerificationCode == token) {
                            //logError("We find shop and token is right");
                            //Отправляем мне смс о новом кафе в нашей системе
                            if (shop.CellPhone == null) sendSMS(SMSconf, conf.myPhone, "new shop registration: "+shop.Name+" "+cellPhone, function (data, response) {console.log(data+" "+response) });
                            Shop.approveCellPhone(shopId, cellPhone, function (error, result) {
                                if (error) {
                                    ShowMessage(res, "Не удалось подтвердить номер телефона, попробуйте зарегистрироваться еще раз ", 500);
                                }
                                else {
                                    Shop.dropToken(shopId, function (error, result) { if (result) console.log(Date.now().toString() + ' token dropped ' + shop.CellPhone); });
                                    //console.log(Date.now().toString() + ' Shop CellPhone is approved ' + result.CellPhone);
                                    //res.render("shops/admin", { shop: shop });
                                    ShowMessage(res, { message: "Номер телефона подтвержден", shopId: shopId }, 200);
                                }
                            });
                        }
                        else {
                            ShowMessage(res, 'Неверный код подтверждения', 500);
                        }
                    });
                } else { ShowMessage(res, "Кто-то уже подтвердил этот номер, придется ввести другой", 500) }
            });
        }
        else {
            ShowMessage(res, 'Неверно заполнена форма подтверждения номера телефона', 500);
        }
    });

    //app.post("/api/upload", function (req, res) {
    //    User.findOne({ _id: req.session.user }, function (error, user) {
    //        if (error) ShowMessage(res, "Не удалось найти пользователя", 500);
    //        else {
    //            //console.log('upload');
    //            //console.log(req.files.uploads);


    //            //var files = [];
    //            //var fileKeys = Object.keys(req.files);

    //            //console.log(req.files);
    //            var files = req.files["uploads"];
    //            console.log(files);
    //            console.log(files.path);
    //            var newPath = uploadsDir + files.name;
    //            var fileData = fs.readFileSync(files.path);
    //            fs.writeFileSync(newPath, fileData);
    //            res.json(files.name, 200);

    //            //var src1 = newPath;
    //            //var dst1 = thumbnailDir + files.name;
    //            //console.log(newPath);
    //            //console.log(dst1);
    //            //console.log('resize');
    //            //gm(newPath).thumb(181, 131, dst1, 100, function (err) {
    //            //    if (!err)
    //            //        console.log("ok");
    //            //    console.log(err);
    //            //});
    //            //im.resize({
    //            //    srcData: fs.readFileSync(src1, 'binary'),
    //            //    width: 186,
    //            //    heigth: 131
    //            //}, function (err, stdout, stderr) {
    //            //    if (err) throw err
    //            //    fs.writeFileSync(dst1, stdout, 'binary');
    //            //    console.log('resized kittens.jpg to fit within 256x256px')
    //            //});

    //            //fs.readFile(files.path, function (err, data) {
    //            //    var newPath = uploadsDir + files.name;
    //            //    console.log(newPath);
    //            //    fs.writeFile(newPath, data, function (err) {


    //            //    });
    //            //});
    //        }
    //    });
    //});



}