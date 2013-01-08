/*!
 * redis-mock
 * (c) 2012 Kristian Faeldt <faeldt_kristian@cyberagent.co.jp>
 */

/**
 * Module dependencies
 */
var item = require("./item.js");

/**
 * Hget
 */
exports.hget = function (mockInstance, hash, key, callback) {

    var value = null;

    if (mockInstance.storage[hash] && mockInstance.storage[hash].hash[key]) {
        value = mockInstance.storage[hash].hash[key];
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

    var b = mockInstance.storage[hash] && mockInstance.storage[hash].hash[key] ? 1 : 0

    if (callback) {
        process.nextTick(function () {
            callback(null, b);
        });
    }
}

/**
 * Hdel
 */
exports.hdel = function (mockInstance, hash, key, callback) {

    var value = 0;

    //TODO: Support multiple values as key
    if (mockInstance.storage[hash] && mockInstance.storage[hash].hash[key]) {
        delete mockInstance.storage[hash].hash[key];
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

    mockInstance.storage[hash] = mockInstance.storage[hash] || new item();

    if (mockInstance.storage[hash].hash[key]) {
        update = true;
    }

    mockInstance.storage[hash].hash[key] = value;

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

    if (!mockInstance.storage[hash] || !mockInstance.storage[hash].hash[key]) {
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