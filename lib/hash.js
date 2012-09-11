/*!
 * redis-mock
 * (c) 2012 Kristian Faeldt <faeldt_kristian@cyberagent.co.jp>
 */

/**
 * Hget
 */
exports.hget = function (mockInstance, hash, key, callback) {

    var value = null;

    if (mockInstance.hash[hash] && mockInstance.hash[hash][key]) {
        value = mockInstance.hash[hash][key];
    }

    if (callback) {
        process.nextTick(function () {
            callback(null, value);
        });
    }
}

/**
 * Hexists
 */
exports.hexists = function (mockInstance, hash, key, callback) {

    if (callback) {
        process.nextTick(function () {
            callback(null, mockInstance.hash[hash] && mockInstance.hash[hash][key] ? 1 : 0);
        });
    }
}

/**
 * Hdel
 */
exports.hdel = function (mockInstance, hash, key, callback) {

    var value = 0;

    //TODO: Support multiple values as key
    if (mockInstance.hash[hash] && mockInstance.hash[hash][key]) {
        delete mockInstance.hash[hash][key];
        value++;
    }

    if (callback) {
        process.nextTick(function () {
            callback(null, value);
        });
    }

}

/**
 * Hset
 */
exports.hset = function (mockInstance, hash, key, value, callback) {

    var update = false;

    mockInstance.hash[hash] = mockInstance.hash[hash] || {};

    if (mockInstance.hash[hash][key]) {
        update = true;
    }

    mockInstance.hash[hash][key] = value;

    if (callback) {
        process.nextTick(function () {
            callback(null, !update ? 1 : 0);
        });
    }
}

/**
 * Hsetnx
 */
exports.hsetnx = function (mockInstance, hash, key, value, callback) {

    if (!mockInstance.hash[hash] || !mockInstance.hash[hash][key]) {
        this.hset(hash, key, value, callback);
    }
    else {
        if (callback) {
            process.nextTick(function () {
                callback(null, 0);
            });
        }
    }

}