var Item = require('./item.js');

var pairMembersWithScores = function(members) {
  var pairs = [];
  for (var i = 0; i < members.length; i += 2) {
    pairs.push([members[i], members[i + 1]]);
  }
  return pairs;
};

var binarySearch = function(scores, score) {
  var min = 0, max = scores.length, mid;
  while (min < max) {
    mid = Math.floor((min + max) / 2);
    if (score < scores[mid]) {
      max = mid - 1;
    } else {
      // Equal scores are placed further to the right.
      min = mid + 1;
    }
  }
  return min;
};

/**
 * Zadd
 */
exports.zadd = function(mockInstance, key, members, callback) {
  if (mockInstance.storage[key] && mockInstance.storage[key].type !== 'zset') {
    var err = new Error('ERR Operation against a key holding the wrong kind of value');
    return mockInstance._callCallback(callback, err);    
  }

  mockInstance.storage[key] = mockInstance.storage[key] ||
                              new Item.createSortedSet();

  var zset = mockInstance.storage[key].value;

  // Add to or update zset.
  var addCount = 0, member, score, index;
  for (var i = 0; i < members.length; i += 2) {
    member = Item._stringify(members[i + 1]);
    score  = members[i];
    index  = zset.map(function(e) { return e[0]; }).indexOf(member);

    if (index >= 0) {
      // Remove from the array
      zset.splice(index, 1);
    } else {
      addCount++;
    }

    // Add to array (and keep the ordering)
    index = binarySearch(zset.map(function(e) { return e[1]; }), score);
    zset.splice(index, 0, [member, score]);
  }

  mockInstance._callCallback(callback, null, addCount);
}

/**
 * Zrem
 */
exports.zrem = function(mockInstance, key, members, callback) {
  var remCount = 0;

  if (mockInstance.storage[key]) {

    if (mockInstance.storage[key].type !== 'zset') {
      var err = new Error('ERR Operation against a key holding the wrong kind of value');
      return mockInstance._callCallback(callback, err);

    } else {
      var zset = mockInstance.storage[key].value;
      for (var i = 0; i < members.length; i++) {
        for (var j = 0; j < zset.length; j++) {
          if (zset[j][0] === Item._stringify(members[i])) {
            zset.splice(j, 1);
            remCount++;
            break;
          }
        }
      }
    }
  }

  mockInstance._callCallback(callback, null, remCount);
}

/**
 * Zrange
 */
exports.zrange = function(mockInstance, key, start, stop, callback) {
  var members = null;

  if (mockInstance.storage[key]) {
    if (mockInstance.storage[key].type !== 'zset') {
      var err = new Error('ERR Operation against a key holding the wrong kind of value');
      return mockInstance._callCallback(callback, err);
    } else {
      members = mockInstance.storage[key].value;
      if (stop < 0) {
        stop = members.length - (stop + 1);
      }
      members = members.slice(start, stop).map(function(e) {
        return e[0];
      });
    }
  }

  mockInstance._callCallback(callback, null, members);
}

/**
 * Zcard
 */
exports.zcard = function(mockInstance, key, callback) {
  var count = 0;

  if (mockInstance.storage[key]) {
    if (mockInstance.storage[key].type !== 'zset') {
      var err = new Error('ERR Operation against a key holding the wrong kind of value');
      return mockInstance._callCallback(callback, err);
    } else {
      var zset = mockInstance.storage[key].value;
      count = zset.length;
    }
  }

  mockInstance._callCallback(callback, null, count);
}
