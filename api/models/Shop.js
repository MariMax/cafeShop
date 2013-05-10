var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId


// Ensure safe writes
var mongoOptions = { db: { safe: true} };




var shopSchema = new Schema({
    //_id: ObjectId,
    Name: String,
    Address: String,
    Description: String,
    WorkTime: String,
    ClientPhone: String,
    CellPhone: String,
    Slogan: String,

    Latitude: Number,
    Longitude: Number,
    Coords:[{type:Number}],
    Logo: Buffer,

    CellPhoneApprove: { type: Boolean, 'default': false },
    CellPhoneVerificationCode: { type: String },
    tempCellPhone: String,
    //DeliveryMethods:[{type:ObjectId,ref:'DeliveryMethod'}],
    //Users:[{type:ObjectId,ref:'User'}],


    CanWorkInShopShop: { type: Boolean, 'default': false }
});

shopSchema.statics.newShop = function (data, cb) {
    console.log("newShop");
    var instance = new Shop();
    instance.Name = data.Name;
    if (data.Address) instance.Address = data.Address;
    if (data.Description) instance.Description = data.Description;
    if (data.WorkTime) instance.WorkTime = data.WorkTime;
    if (data.ClientPhone) instance.ClientPhone = data.ClientPhone;
    if (data.cellPhone) instance.tempCellPhone = data.cellPhone;
    if (data.Latitude) instance.Latitude = data.Latitude;
    if (data.Longitude) instance.Longitude = data.Longitude;
    if (data.Latitude && data.Longitude) { instance.Coords = []; instance.Coords.push(data.Longitude); instance.Coords.push(data.Latitude); }

    var newPassword = '';
    newPassword = newPassword.randomNumberString(6);
    instance.CellPhoneVerificationCode = newPassword;



    instance.save(function (error, data) {
        if (error) {
            cb(error);
        }
        else {
            cb(null, instance);
        }
    });
}

shopSchema.statics.UpdateShopValue = function (shopId, data, cb) {
    console.log("UpdateValueOfShop");
    var newdata = {};
    if (data.Name && data.Name != '') newdata.Name = data.Name;
    if (data.Address && data.Address != '') newdata.Address = data.Address;
    if (data.Description && data.Description != '') newdata.Description = data.Description;
    if (data.WorkTime && data.WorkTime != '') newdata.WorkTime = data.WorkTime;
    if (data.ClientPhone && data.ClientPhone != '') newdata.ClientPhone = data.ClientPhone;
    //if (data.CellPhone&&data.CellPhone!='') newdata.CellPhone=data.CellPhone; Отдельная тема
    if (data.Latitude) newdata.Latitude = data.Latitude;
    if (data.Longitude) newdata.Longitude = data.Longitude;
    if (data.Latitude && data.Longitude) { newdata.Coords = []; newdata.Coords.push(data.Longitude);newdata.Coords.push(data.Latitude); }

    this.findByIdAndUpdate(shopId, { $set: newdata }, { multi: false, safe: true }, function (error, docs) {
        if (error) {
            cb(error);
        }
        else {
            Shop.findOne({ _id: shopId }, cb)
        }
    })
};

shopSchema.statics.dropToken = function (shopId, callback) {

    this.findByIdAndUpdate(shopId, { $set: { CellPhoneVerificationCode: '', tempCellPhone: ''} }, { multi: false, safe: true }, function (error, docs) {
        if (error) {
            callback(error);
        }
        else {
            Shop.findOne({ _id: shopId }, callback);

        }
    })
}

shopSchema.statics.approveCellPhone = function (shopId, cellPhone, callback) {

    this.findByIdAndUpdate(shopId, { $set: { CellPhoneApprove: true, CellPhone: cellPhone, tempCellPhone: ''} }, { multi: false, safe: true }, function (error, docs) {
        if (error) {
            callback(error);
        }
        else {
            Shop.findOne({ CellPhone: cellPhone }, callback)

        }
    })

};

shopSchema.statics.UpdateCellPhone = function (shopId, cellPhone, callback) {
    var newPassword = '';
    newPassword = newPassword.randomNumberString(6);
    console.log('Verify code: ' + newPassword);
    this.findByIdAndUpdate(shopId, { $set: { tempCellPhone: cellPhone, CellPhoneVerificationCode: newPassword} }, { multi: false, safe: true }, function (error, docs) {
        if (error) {
            callback(error);
        }
        else {
            Shop.findOne({ _id: shopId }, callback)
        }
    })

};

shopSchema.statics.getShop = function (shopId, callback) {
    this.findOne({ _id: shopId }, callback);
}

Shop = mongoose.model('Shop', shopSchema);
exports.Shop = Shop;