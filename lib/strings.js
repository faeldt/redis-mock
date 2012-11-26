/*!
 * redis-mock
 * (c) 2012 Kristian Faeldt <faeldt_kristian@cyberagent.co.jp>
 */

/**
 * Set
 */
exports.set = function (mockInstance, key, value, callback) {

    mockInstance.storage[key] = value;

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

