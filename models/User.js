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
    token: {type:String, 'default':hash(Date.now.toString(),conf.secret)}
});

UserSchema.path('email').validate(function (v, fn) {
    User.count({email: v}, function (err, val) {
        if (err) fn(false);
        fn(val==0);
    });
}, 'Такой email уже существует!');

UserSchema.statics.authenticate = function (email, password, fn) {
    this.findOne({email: email, approve:true}, function (err, user) {
        if (!user) return fn(new Error('Такой пользователь не существует или email не подтвержден'));
        if (user.password == hash(password, conf.secret)) return fn(null, user);
        // Otherwise password is invalid
        fn(new Error('Неверный пароль'));
    });
};

UserSchema.statics.approve = function (userId, callback) {
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
    var newToken = hash(Date.now.toString(), conf.secret);
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

UserSchema.statics.newUser = function (email, password, fn) {
    var instance = new User();
    instance.email = email;
    instance.password = hash(password, conf.secret);
    instance.approve = false;


    instance.save(function (err) {
        fn(err, instance);
        /*Необходимо отправить проверку email в callback*/
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