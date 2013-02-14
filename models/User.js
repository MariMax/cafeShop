var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
    , commonFunctions = require('./CommonFunctions')
    , hash =commonFunctions.hash
    , required = commonFunctions.required;

mongoTypes.loadTypes(mongoose, 'email');
mongoose.connect('mongodb://localhost/cafeShop');





var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    _cafe:{type:ObjectId,ref:'Cafe'},
    UserName:String,
    email: {
        type: mongoose.SchemaTypes.Email,
        validate: [required, 'Введите Email'],
        index: { unique: true }
    },
    password: {
        type: String,
        validate: [required, 'Введите пароль']
    },
    createdAt: {
        type: Date,
        'default': Date.now
    },
    approve:{type:Boolean,'default':false},
    token: {type:String, 'default':hash(Date.now().toString(),conf.secret)},
    approveInCurrentCafe:{type:Boolean,'default':false}
});

UserSchema.path('email').validate(function (v, fn) {
    User.count({email: v}, function (err, val) {
        if (err) fn(false);
        fn(val==0);
    });
}, 'Такой email уже существует!');

UserSchema.statics.authenticate = function (email, password, fn) {
    this.findOne({email: email}, function (err, user) {
        if (!user) return fn(new Error('Такой пользователь не существует'));
        if (!user.approve) return fn(new Error('email не подтвержден'));
        //if (!user.approveInCurrentCafe) return fn(new Error('Пользователь не является сотрудником ни одного кафе'));
        if (user.password == hash(password, conf.secret)) return fn(null, user);
        // Otherwise password is invalid
        fn(new Error('Неверный пароль'));
    });
};

UserSchema.statics.assignWithCafe=function(cafeID,userID,callback){
     var data = {}
    data._cafe = cafeID;
    this.update({_id: userID}
        , {$set: data}
        , {multi:false,safe:true}
        , function( error, docs ) {
            if (error) {
                callback(error);
            }
            else {
                callback(null, true);
            }
        });
};

UserSchema.statics.approveInCafe= function(cafeID, userID, callback) {
     var data = {}
    data.approveInCurrentCafe = true;
    this.update({_id: userID}
        , {$set: data}
        , {multi:false,safe:true}
        , function( error, docs ) {
            if (error) {
                callback(error);
            }
            else {
                callback(null, true);
            }
        });
};

UserSchema.statics.approveEmail = function (userId, callback) {


    var data = {}
    data.approve = true;
    this.update({_id: userId}
        , {$set: data}
        , {multi:false,safe:true}
        , function( error, docs ) {
            if (error) {
                callback(error);
            }
            else {
                callback(null, true);
            }
        });
};

UserSchema.statics.generateNewToken = function (userId, callback) {
    var newToken = hash(Date.now().toString(), conf.secret);
    var data = {}
    data.token = newToken;
    this.update({_id: userId}
        , {$set: data}
        , {multi:false,safe:true}
        , function( error, docs ) {
            if (error) {
                callback(error);
            }
            else {
                callback(null, newToken);
            }
        });
};

UserSchema.statics.dropToken = function (userId, callback) {
   
    var data = {}
    data.token = null;
    this.update({_id: userId}
        , {$set: data}
        , {multi:false,safe:true}
        , function( error, docs ) {
            if (error) {
                callback(error);
            }
            else {
                callback(null, true);
            }
        });
};

UserSchema.statics.newUser = function (email, password, userName, fn) {
    var instance = new User();
    instance.email = email;
    instance.password = hash(password, conf.secret);
    instance.approve = false;
    instance.UserName = userName;


    instance.save(function (err) {
        fn(err, instance);
    });
};

UserSchema.statics.resetPassword = function(userId, callback) {
    var newPassword = '';
    newPassword = newPassword.randomString(6);
    var cripto = hash(newPassword, conf.secret);
    var data = {}
    data.password = cripto;

    this.update({_id: userId}
        , {$set: data}
        , {multi:false,safe:true}
        , function( error, docs ) {
            if (error) {
                callback(error);
            }
            else {
                callback(null, newPassword);
            }
        });


}

User = mongoose.model('User', UserSchema);

exports.User = User;