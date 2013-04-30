/*!
 * redis-mock
 * (c) 2012 Kristian Faeldt <kristian.faeldt@gmail.com>
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

/*
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

/**
 * Hgetall
 */
exports.hgetall = function(mockInstance, hash, callback) {

	// TODO: Confirm if this should return null or empty obj when key does not eist
	var obj = {};

	if (mockInstance.storage[hash]) {
		for (var k in mockInstance.storage[hash].hash) {
			obj[k] = mockInstance.storage[hash].hash[k];
		}
	}

	if (callback) {
		process.nextTick(function() {
			callback(null, obj);
		});
	}
}

/**
 * Hkeys
 */
exports.hkeys = function(mockInstance, hash, callback) {

	var list = [];

	if (mockInstance.storage[hash]) {
		for (var k in mockInstance.storage[hash].hash) {
			list.push(k);
		}
	}

	if (callback) {
		process.nextTick(function() {
			callback(null, list);
		});
	}
}

/**
 * Hmset
 */
exports.hmset = function(mockInstance) {

	// We require at least 3 arguments
	// 0: mockInstance
	// 1: hash name
	// 2: key/value object or first key name
	if (arguments.length <= 3) {
		return;
	}

	var keyValuesToAdd = {};

	if ('object' == typeof arguments[2]) {
		
		keyValuesToAdd = arguments[2];		

	} else {
		
		for (var i = 2; i < arguments.length; i += 2) {
			
			// Array big enough to have both a key and value
			if (arguments.length > (i+1)) {
				var newKey = arguments[i];
				var newValue = arguments[i+1];
	
				// Neither key nor value is a callback
				if ('function' !== typeof newKey && 'function' !== typeof newValue) {
				
					keyValuesToAdd[newKey] = newValue;

				} else {
					break;
				}
			} else {
				break;
			}
		}
	}
	
	var hash = arguments[1];

    mockInstance.storage[hash] = mockInstance.storage[hash] || new item();

	for (var k in keyValuesToAdd) {
		mockInstance.storage[hash].hash[k] = keyValuesToAdd[k];
	}

	// Do we have a callback?
	if ('function' === typeof arguments[arguments.length-1]) {

		var callback = arguments[arguments.length-1];

		process.nextTick(function() {	
			callback(null, "OK");
		});
	}
}

/**
 * Hlen
 */
exports.hlen = function (mockInstance, hash, callback) {

	if (!mockInstance.storage[hash]) { 
		if (callback) {
			process.nextTick(function() {
				callback(null, 0);
				return;
			});
		}
	}
	else {
		var cnt = 0;
		for (var p in mockInstance.storage[hash].hash) {
			if (mockInstance.storage[hash].hash.hasOwnProperty(p)) {
				cnt++;
			}
		}

		if (callback) {
			process.nextTick(function() {
				callback(null, cnt);
				return;
			});
		}
	}
}
