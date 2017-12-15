/*!
 * redis-mock
 * (c) 2012 Kristian Faeldt <kristian.faeldt@gmail.com>
 */


/**
 * flushdb
 */
exports.flushdb = flushdb = function (mockInstance, callback) {
  mockInstance.storage = {};

  mockInstance._callCallback(callback, null, 'OK');
}

/**
 * flushall
 * Exact the same as flushdb because multiple db is not supported yet
 */
exports.flushall = flushdb;

/**
 * scan
 */
// TODO: Support expanded arguments
exports.scan = scan = function (mockInstance, args, callback) {
  var cursor = args[0];
  args = args.slice(1);

  /* Simulate random max returned elements (10 - 35 keys) */
  var count = Math.floor(Math.random() * 25 + cursor + 10)
  var pattern = '*'

  /* Parse arguments array */
  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (typeof arg === 'string') arg = arg.toLowerCase();
    if (i + 1 < args.length) {
      if (arg === 'count') {
        count = Number(args[i + 1]);
        i++;
      }
      if (arg === 'match') {
        pattern = args[i + 1];
        i++;
      }
    }
  }
  var regex = mockInstance._patternToRegex(pattern);
  var keys = [];

  for (var key in mockInstance.storage) {
    if (regex.test(key)) {
      keys.push(key);
    }
  }

  var matched = keys.slice(cursor, count + cursor);
  return mockInstance._callCallback(callback, null, [Math.min(count, matched.length), matched]);
}
