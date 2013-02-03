
/*
 *  Copyright (C) 2011-2012 Lethus tecnologia da informação
 *      <www.lethus.com.br>
 *
 *   Damon Abdiel <damon.abdiel@gmail.com>
 *   Wilson Pinto Júnior <wilsonpjunior@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var mongoose = require('mongoose')
    , crypto = require('crypto')
    , mongoTypes = require('mongoose-types');

mongoTypes.loadTypes(mongoose, 'email');
mongoose.connect('mongodb://localhost/cafeShop');

function hash (msg, key) {
    return crypto.createHmac('sha256', key).update(msg).digest('hex');
};

function required(val) { return val && val.length; }

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
        default: Date.now
    },
    approve:{type:Boolean,'default':false}
});

UserSchema.path('email').validate(function (v, fn) {
    User.count({email: v}, function (err, val) {
        if (err) fn(false);
        fn(val==0);
    });
}, 'Такой email уже существует!');

UserSchema.statics.authenticate = function (email, password, fn) {
    this.findOne({email: email}, function (err, user) {
        if (!user) return fn(new Error('Такой пользователь не существует или email не подтвержден'));
        if (user.password == hash(password, conf.secret)) return fn(null, user);
        // Otherwise password is invalid
        fn(new Error('Неверный пароль'));
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