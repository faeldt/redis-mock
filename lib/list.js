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

    for (var i = 0; i < values.length; i++) {
      mockInstance.storage[key].lpush(values[i]);
    }
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

    for (var i = 0; i < values.length; i++) {
      mockInstance.storage[key].rpush(values[i]);
    }
    callback(null, mockInstance.storage[key].list.length);
}

/**
 * Rpushx
 */
exports.rpushx = function (mockInstance, key, value, callback) {
    if (!mockInstance.storage[key]) {
      callback(null, 0);
      return;
    }
    mockInstance.storage[key].rpush(value);
    callback(null, mockInstance.storage[key].list.length);
}

/**
 * Lpushx
 */
exports.lpushx = function (mockInstance, key, value, callback) {
    if (!mockInstance.storage[key]) {
      callback(null, 0);
      return;
    }
    mockInstance.storage[key].lpush(value);
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
  callback(null, mockInstance.storage[key].lpop());
}

/**
 * Rpop
 */
exports.rpop = function (mockInstance, key, callback) {
  if (!mockInstance.storage[key] || mockInstance.storage[key].list.length === 0) {
    callback(null, null);
    return;
  }
  callback(null, mockInstance.storage[key].rpop());
}

/**
 * Lindex
 */
exports.lindex = function (mockInstance, key, index, callback) {
  if (!mockInstance.storage[key] || mockInstance.storage[key].list.length <= index
                                 || -mockInstance.storage[key].list.length > index) {
    callback(null, null);
    return;
  }
  if (index < 0) {
    callback(null, mockInstance.storage[key].list[mockInstance.storage[key].list.length + index]);
  } else {
    callback(null, mockInstance.storage[key].list[index]);
  }
}

/**
 * Lset
 */
exports.lset = function (mockInstance, key, index, value, callback) {
  if (!mockInstance.storage[key]) {
    callback(null, "ERR no such key");
  } else if (mockInstance.storage[key].list.length <= index
             || -mockInstance.storage[key].list.length > index) {
    callback(null, "ERR index out of range");
  } else {
    if (index < 0) {
      mockInstance.storage[key].list[mockInstance.storage[key].list.length + index] = value;
    } else {
      mockInstance.storage[key].list[index] = value;
    }
    callback(null, "OK");
  }
}
