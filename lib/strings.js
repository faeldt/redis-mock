var Item = require("./item.js");
/*!
 * redis-mock
 * (c) 2012 Kristian Faeldt <kristian.faeldt@gmail.com>
 */

/**
 * Set
 */
exports.set = function (mockInstance, key, value, callback) {

    mockInstance.storage[key] = Item.createString(value);

    mockInstance._callCallback(callback, null, "OK");
}

/**
 * Get
 */
exports.get = function (mockInstance, key, callback) {

    var value = null;
    var err = null;

    if (mockInstance.storage[key]) {
        if (mockInstance.storage[key].type !== "string") {
            err = new Error("ERR Operation against a key holding the wrong kind of value");
        } else {
            value = mockInstance.storage[key].value;
        }
    }

    mockInstance._callCallback(callback, err, value);
}

/**
 * Incr
 */
exports.incr = function (mockInstance, key, callback) {

    function _isInteger (s) {
        return parseInt(s, 10) == s;
    }

    if (!mockInstance.storage[key]) {
        var number = 0 + 1;
        exports.set(mockInstance, key, number);
        mockInstance._callCallback(callback, null, number);

    } else if (mockInstance.storage[key].type !== "string") {
        var err = new Error("ERR Operation against a key holding the wrong kind of value");
        mockInstance._callCallback(callback, err, null);

    } else if (_isInteger(mockInstance.storage[key].value)) {
        var number = parseInt(mockInstance.storage[key].value, 10) + 1;
        exports.set(mockInstance, key, number);
        mockInstance._callCallback(callback, null, number);

    } else {
        var err = new Error("ERR value is not an integer or out of range");
        mockInstance._callCallback(callback, err, null);
    }
}

/**
 * Setex
 */
exports.setex = function (mockInstance, key, seconds, value, callback) {
  var self = this;
  self.set(key, value, function() {
    self.expire(key, seconds, callback);
  });
}

/**
 * Setnx
 */
exports.setnx = function (mockInstance, key, value, callback) {
    if (key in mockInstance.storage) {
        mockInstance._callCallback(callback, null, 0);
    } else {
        exports.set(mockInstance, key, value, /*callback);,*/ function() {
             mockInstance._callCallback(callback, null, 1);
        });
    }
};
