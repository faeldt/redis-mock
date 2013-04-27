var Item = require("./item.js");

/**
 * Llen
 */
exports.llen = function (mockInstance, key, callback) {
  callback(null, mockInstance.storage[key] ? mockInstance.storage[key].list.length : 0);
}

var push = function(fn, mockInstance, key, values, callback) {
    mockInstance.storage[key] = mockInstance.storage[key] || new Item();

    fn.call(mockInstance.storage[key], values);

    callback(null, mockInstance.storage[key].list.length);
};

/**
 * Lpush
 */
exports.lpush = function (mockInstance, key, values, callback) {
  push(Item.prototype.lpush, mockInstance, key, values, callback);
}

/**
 * Rpush
 */
exports.rpush = function (mockInstance, key, values, callback) {
  push(Item.prototype.rpush, mockInstance, key, values, callback);
}

var pushx = function(fn, mockInstance, key, value, callback) {
  if (!mockInstance.storage[key]) {
    callback(null, 0);
    return;
  }
  fn.call(mockInstance.storage[key], [value]);

  callback(null, mockInstance.storage[key].list.length);
};

/**
 * Rpushx
 */
exports.rpushx = function (mockInstance, key, value, callback) {
    pushx(Item.prototype.rpush, mockInstance, key, value, callback);
}

/**
 * Lpushx
 */
exports.lpushx = function (mockInstance, key, value, callback) {
    pushx(Item.prototype.lpush, mockInstance, key, value, callback);
}

var pop = function(fn, mockInstance, key, callback) {
  if (!mockInstance.storage[key] || mockInstance.storage[key].list.length === 0) {
    callback(null, null);
    return;
  }
  callback(null, fn.call(mockInstance.storage[key]));
};

/**
 * Lpop
 */
exports.lpop = function (mockInstance, key, callback) {
  pop.call(this, Item.prototype.lpop, mockInstance, key, callback);
}

/**
 * Rpop
 */
exports.rpop = function (mockInstance, key, callback) {
  pop.call(this, Item.prototype.rpop, mockInstance, key, callback);
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
