var Item = require("./item.js");

/**
 * Llen
 */
exports.llen = function (mockInstance, key, callback) {
  callback(null, mockInstance.storage[key] ? mockInstance.storage[key].list.length : 0);
}

/**
 * Lpush
 */
exports.lpush = function (mockInstance, key, values, callback) {
    if (!(values instanceof Array)) {
        values = [values];
    }

    mockInstance.storage[key] = mockInstance.storage[key] || new Item();

    mockInstance.storage[key].list = values.concat(mockInstance.storage[key].list);
    callback(null, mockInstance.storage[key].list.length);
}

/**
 * Rpush
 */
exports.rpush = function (mockInstance, key, values, callback) {
    if (!(values instanceof Array)) {
        values = [values];
    }

    mockInstance.storage[key] = mockInstance.storage[key] || new Item();

    mockInstance.storage[key].list = mockInstance.storage[key].list.concat(values);
    callback(null, mockInstance.storage[key].list.length);
}

/**
 * Lpop
 */
exports.lpop = function (mockInstance, key, callback) {
  if (!mockInstance.storage[key] || mockInstance.storage[key].list.length === 0) {
    callback(null, null);
    return;
  }
  callback(null, mockInstance.storage[key].list.shift());
}

/**
 * Rpop
 */
exports.rpop = function (mockInstance, key, callback) {
  if (!mockInstance.storage[key] || mockInstance.storage[key].list.length === 0) {
    callback(null, null);
    return;
  }
  callback(null, mockInstance.storage[key].list.pop());
}
