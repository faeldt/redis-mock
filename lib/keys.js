/*!
 * redis-mock
 * (c) 2012 Kristian Faeldt <faeldt_kristian@cyberagent.co.jp>
 */

/**
 * Del
 */
exports.del = function (mockInstance, keys, callback) {
    
    if (!(keys instanceof Array)) {
        keys = [keys];
    }

    var keysDeleted = 0;

    for (var i = 0; i < keys.length; i++) {
        
        if (keys[i] in mockInstance.storage) {

            delete mockInstance.storage[keys[i]];
            keysDeleted++;

        }
    }

    if (callback) {
        process.nextTick(function () {
            callback(null, keysDeleted);
        });
    }
}

/**
 * Exists
 */
exports.exists = function (mockInstance, key, callback) {

    var result = key in mockInstance.storage ? 1 : 0;

    if (callback) {
        process.nextTick(function () {
            callback(null, result);
        });
    }
}

/**
 * Expire
 */
exports.expire = function (mockInstance, key, seconds, callback) {

     var result = 0;

     var obj = mockInstance.storage[key];

     if (obj) {

         mockInstance.storage[key].expires = seconds;
         result = 1;
     }

     if (callback) {
         process.nextTick(function () {
             callback(null, result);
         });
     }
 }