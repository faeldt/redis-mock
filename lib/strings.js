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

exports.mget = function (mockInstance) {

    var keys = [];
    var err = null;

    // Build up the set of keys
    if ('object' == typeof arguments[1]) {
      keys = arguments[1];
    } else {
      for (var i = 1; i < arguments.length; i++) {
        var key = arguments[i];
        if ('function' !== typeof key) {
          keys.push(key);
        }
      }
    }

    var values = [];
    for (var j = 0; j < keys.length; j++) {
        if (mockInstance.storage[keys[j]]) {
            if (mockInstance.storage[keys[j]].type !== 'string') {
                err = new Error("ERR Operation against key " + keys[j] + " holding wrong kind of value");
            } else {
                values.push(mockInstance.storage[keys[j]].value);
            }
        } else {
          values.push(null);
        }
    }

  if ('function' === typeof arguments[arguments.length-1]) {
    mockInstance._callCallback(arguments[arguments.length-1], err, values);
  }

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
