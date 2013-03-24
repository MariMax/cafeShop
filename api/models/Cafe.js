var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId


//var uristring = 'mongodb://localhost/cafeShop';
var uristring = 'mongodb://nodejitsu_marimax:nv3cr1i421o6f4p5ibonma0npq@ds051977.mongolab.com:51977/nodejitsu_marimax_nodejitsudb6949724517';
// Ensure safe writes
var mongoOptions = { db: { safe: true} };


// Connect
mongoose.connect(uristring, mongoOptions, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + uristring);
    }
});

var cafeSchema = new Schema({
    //_id: ObjectId,
    Name:String,
    Address:String,
    Description:String,
    WorkTime:String,
    ClientPhone:String,
    CellPhone:String,
    Slogan:String,
    
    Latitude:Number ,
    Longitude:Number ,
    Logo: Buffer,
    
    CellPhoneApprove:{type:Boolean,'default':false},
    CellPhoneVerificationCode:{type:String},
    tempCellPhone:String,
    //DeliveryMethods:[{type:ObjectId,ref:'DeliveryMethod'}],
    //Users:[{type:ObjectId,ref:'User'}],
    //Dishes:[{type:ObjectId,ref:'Dish'}],
    //Menus:[{type:ObjectId,ref:'Menu'}],
    //Orders:[{type:ObjectId,ref:'Order'}],
    CanWorkInCafeShop:{type:Boolean,'default':true}
});

cafeSchema.statics.newCafe = function (data, cb) {
    console.log("newCafe");
    var instance = new Cafe();
    instance.Name = data.Name;
    if (data.Address) instance.Address = data.Address;
    if (data.Description) instance.Description = data.Description;
    if (data.WorkTime) instance.WorkTime = data.WorkTime;
    if (data.ClientPhone) instance.ClientPhone = data.ClientPhone;
    if (data.cellPhone) instance.tempCellPhone = data.cellPhone;
    if (data.Latitude) instance.Latitude = data.Latitude;
    if (data.Longitude) instance.Longitude = data.Longitude;
    
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
        //mongoose.connection.close()
    });
}

cafeSchema.statics.UpdateCafeValue = function (cafeId,data, cb) {
    console.log("UpdateValueOfCafe");
    var newdata = {};
    if (data.Name&&data.Name!='') newdata.Name=data.Name;
    if (data.Address&&data.Address!='') newdata.Address=data.Address;
    if (data.Description&&data.Description!='') newdata.Description=data.Description;
    if (data.WorkTime&&data.WorkTime!='') newdata.WorkTime=data.WorkTime;
    if (data.ClientPhone&&data.ClientPhone!='') newdata.ClientPhone=data.ClientPhone;
    //if (data.CellPhone&&data.CellPhone!='') newdata.CellPhone=data.CellPhone; Отдельная тема
    if (data.Latitude) newdata.Latitude=data.Latitude;
    if (data.Longitude) newdata.Longitude=data.Longitude;

    this.findByIdAndUpdate(cafeId, { $set: newdata }, { multi: false, safe: true }, function (error, docs) {
        if (error) {
            cb(error);
        }
        else {
            Cafe.findOne({ _id: cafeId }, cb)
            
        }
    })

    
};

cafeSchema.statics.dropToken = function (cafeId, callback) {

    this.findByIdAndUpdate(cafeId, { $set: { CellPhoneVerificationCode: '', tempCellPhone: ''} }, { multi: false, safe: true }, function (error, docs) {
        if (error) {
            callback(error);
        }
        else {
            Cafe.findOne({ _id: cafeId }, callback);

        }
    })
}

    cafeSchema.statics.approveCellPhone = function (cafeId, cellPhone, callback) {

    this.findByIdAndUpdate(cafeId, { $set: { CellPhoneApprove: true, CellPhone: cellPhone, tempCellPhone: ''} }, { multi: false, safe: true }, function (error, docs) {
        if (error) {
            callback(error);
        }
        else {
            Cafe.findOne({ CellPhone: cellPhone }, callback)
            
        }
    })

};

cafeSchema.statics.UpdateCellPhone = function (cafeId, cellPhone, callback) {
    var newPassword = '';
    newPassword = newPassword.randomNumberString(6);
    console.log('Verify code: '+newPassword);
    this.findByIdAndUpdate(cafeId, { $set: { tempCellPhone: cellPhone, CellPhoneVerificationCode: newPassword} }, { multi: false, safe: true }, function (error, docs) {
        if (error) {
            callback(error);
        }
        else {
            Cafe.findOne({ _id: cafeId }, callback)
        }
    })

};

Cafe = mongoose.model('Cafe', cafeSchema);
exports.Cafe = Cafe;