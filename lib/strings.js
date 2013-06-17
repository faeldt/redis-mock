/*!
 * redis-mock
 * (c) 2012 Kristian Faeldt <kristian.faeldt@gmail.com>
 */

/**
 * Set
 */
exports.set = function (mockInstance, key, value, callback) {

    mockInstance.storage[key] = value + "";

    if (callback) {
        process.nextTick(function () {
            callback(null, "OK");
        });
    }
}

/**
 * Get
 */
exports.get = function (mockInstance, key, callback) {

    var value = null;

    if (mockInstance.storage[key]) {
        value = mockInstance.storage[key];
    }

    if (callback) {
        process.nextTick(function () {
            callback(null, value);
        });
    }
}

/**
 * Incr
 */
exports.incr = function (mockInstance, key, callback) {

    function isInteger (s) {
        return parseInt(s, 10) == s;
    }

    var value = mockInstance.storage[key];

    if (value) {
        if (isInteger(value)) {
            var number = parseInt(value, 10) + 1;
            exports.set(mockInstance, key, number, function () {
                callback(null, number);
            });
        }
    } else {
        var number = 0 + 1;
        exports.set(mockInstance, key, number, function () {
            callback(null, number);
        });
    }
}