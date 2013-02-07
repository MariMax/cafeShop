var crypto = require('crypto')

exports.hash =  function hash (msg, key) {
    return crypto.createHmac('sha256', key).update(msg).digest('hex');
};

exports.required = function required(val) { return val && val.length; }