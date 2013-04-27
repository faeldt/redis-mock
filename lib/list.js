var Item = require("./item.js");

/**
 * Helper function to launch the callback(err, reply)
 * on the next process tick
 */
var callCallback = function(callback, err, reply) {
  if (callback) {
    process.nextTick(function() {
      callback(null, reply);
    });
  }
};

/**
 * Llen
 */
exports.llen = function (mockInstance, key, callback) {
  var length = mockInstance.storage[key] ? mockInstance.storage[key].list.length : 0;
  callCallback(callback, null, length);
}

var push = function(fn, mockInstance, key, values, callback) {
    mockInstance.storage[key] = mockInstance.storage[key] || new Item();

    fn.call(mockInstance.storage[key], values);
    var length = mockInstance.storage[key].list.length;
    callCallback(callback, null, length);
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
  var length = 0;
  if (mockInstance.storage[key]) {
    fn.call(mockInstance.storage[key], [value]);
    length = mockInstance.storage[key].list.length;
  }
  callCallback(callback, null, length);
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
  var val = null;
  if (mockInstance.storage[key] && mockInstance.storage[key].list.length > 0) {
    val = fn.call(mockInstance.storage[key]);
  }
  callCallback(callback, null, val);
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
  var val = null;
  if (mockInstance.storage[key]) {
    if (index < 0 && -mockInstance.storage[key].list.length <= index) {
      val = mockInstance.storage[key].list[mockInstance.storage[key].list.length + index];
    } else if (mockInstance.storage[key].list.length > index) {
      val = mockInstance.storage[key].list[index];
    }
  }
  callCallback(callback, null, val);
}

/**
 * Lset
 */
exports.lset = function (mockInstance, key, index, value, callback) {
  var res = "OK";
  if (!mockInstance.storage[key]) {
    res = "ERR no such key";
  } else if (mockInstance.storage[key].list.length <= index
             || -mockInstance.storage[key].list.length > index) {
    res = "ERR index out of range";
  } else {
    if (index < 0) {
      mockInstance.storage[key].list[mockInstance.storage[key].list.length + index] = value;
    } else {
      mockInstance.storage[key].list[index] = value;
    }
  }
  callCallback(callback, null, res);
}
