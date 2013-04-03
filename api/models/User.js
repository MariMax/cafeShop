var mongoose = require('mongoose')
    , mongoTypes = require('mongoose-types')
    , commonFunctions = require('./CommonFunctions')
    , hash =commonFunctions.hash
    , required = commonFunctions.required;

mongoTypes.loadTypes(mongoose, 'email');


var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    _cafe:{type:ObjectId,ref:'Cafe'},
    UserName:String,
    email: mongoose.SchemaTypes.Email,
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
    approveInCurrentCafe:{type:Boolean,'default':false},
    tempemail: mongoose.SchemaTypes.Email
});

UserSchema.path('email').validate(function (v, fn) {
    User.count({email: v}, function (err, val) {
        if (err) fn(false);
        fn(val==0);
    });
}, 'Такой email уже существует!');

UserSchema.statics.getAllApprovedUsersInCafe = function (cafeId, callback) {
    this.find({ _cafe: cafeId, approveInCurrentCafe: true }, callback);
}

UserSchema.statics.getFirstApprovedUserInCafe = function (cafeId, callback) {
    this.findOne({ _cafe: cafeId, approveInCurrentCafe: true }, callback);
}

UserSchema.statics.getAllUsersInCafe = function (cafeId, callback) {
    this.find({ _cafe: cafeId }, callback);
}

UserSchema.statics.getAllUnApprovedUsersInCafe = function (cafeId, callback) {
    this.find({ _cafe: cafeId, approveInCurrentCafe: false }, callback);
}

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

UserSchema.statics.UpdatePassword = function (userId, oldPassword, newPassword, fn) {
    this.findOne({ _id: userId }, function (err, user) {
        if (!user) return fn(new Error('User does not exist'));
        if (!user.approve) return fn(new Error('email in not approved'));
        //if (!user.approveInCurrentCafe) return fn(new Error('Пользователь не является сотрудником ни одного кафе'));
        if (user.password == hash(oldPassword, conf.secret)) {
            var data = {}
            data.password =hash(newPassword, conf.secret);
            User.update({ _id: userId }
        , { $set: data }
        , { multi: false, safe: true }
        , function (error, docs) {
            if (error) {
                fn(error);
            }
            else {
                 User.findOne({ _id: userId }, fn);
            }
        });

        } else {
            // Otherwise password is invalid
            fn(new Error('password is invalid'));
        }
    });
};

UserSchema.statics.assignWithCafe = function (cafeID, userID, callback) {
    var data = {}
    data._cafe = cafeID;
    this.update({ _id: userID }
        , { $set: data }
        , { multi: false, safe: true }
        , function (error, docs) {
            if (error) {
                callback(error);
            }
            else {
                User.findOne({_id:userID},callback)
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

UserSchema.statics.approveEmail = function (userId, email, callback) {

    this.findByIdAndUpdate(userId, { $set: { approve: true, email: email, tempemail: ''} }, { multi: false, safe: true }, function (error, docs) {
        if (error) {
            callback(error);
        }
        else {
            User.findOne({ email: email }, callback)
            
        }
    })
    //this.findOne({ _id: userId }, function (error, user) {
    //    console.log(user.tempemail);
    //    this.update({ _id: userId }
    //    , { approve: true, email: user.tempemail, tempemail: '' }
    //    , { multi: false, safe: true }
    //    , function (error, docs) {
    //        if (error) {
    //            callback(error);
    //        }
    //        else {
    //            callback(null, true);
    //        }
    //    }    );
    //});
};

UserSchema.statics.UpdateEmail = function (userId, newEmail, callback) {
    var data = {}
    data.tempemail = newEmail;
    this.update({_id: userId}
        , {$set: data}
        , {multi:false,safe:true}
        , function( error, docs ) {
            if (error) {
                callback(error);
            }
            else {
                callback(null, newEmail);
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

    this.findByIdAndUpdate(userId, { $set: { token: null, tempemail: ''} }, { multi: false, safe: true }, function (error, docs) {
        if (error) {
            callback(error);
        }
        else {
            User.findOne({ _id: userId }, function (error, user) {
                if (error) callback(error); else
                    if (!user.approve) User.findByIdAndRemove(userId, callback); else callback(null, user);
            })

        }
    })
    /* var data = {}
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
    });*/
};

UserSchema.statics.newUser = function (email, password, userName, fn) {
    var instance = new User();
    instance.tempemail = email;
    instance.password = hash(password, conf.secret);
    instance.approve = false;
    instance.UserName = userName;


    instance.save(function (err) {
        fn(err, instance);
    });
};

UserSchema.statics.resetPassword = function (userId, callback) {
    var newPassword = '';
    newPassword = newPassword.randomString(6);
    var cripto = hash(newPassword, conf.secret);
    var data = {}
    data.password = cripto;

    this.update({ _id: userId }
        , { $set: data }
        , { multi: false, safe: true }
        , function (error, docs) {
            if (error) {
                callback(error);
            }
            else {
                callback(null, newPassword);
            }
        });
}

UserSchema.statics.UpdateName = function(userId, newName, callback) {
    var data = {}
    data.UserName = newName;

    this.update({_id: userId}
        , {$set: data}
        , {multi:false,safe:true}
        , function( error, docs ) {
            if (error) {
                callback(error);
            }
            else {
                callback(null, newName);
            }
        });
}

User = mongoose.model('User', UserSchema);

exports.User = User;