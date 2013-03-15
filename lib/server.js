/*!
 * redis-mock
 * (c) 2012 Kristian Faeldt <faeldt_kristian@cyberagent.co.jp>
 */


/**
 * flushdb
 */
exports.flushdb = flushdb = function(mockInstance, callback) {
	mockInstance.storage = {};

	if (callback) {
        process.nextTick(function () {
            callback(null, 'OK');
        });
    }
}

/**
 * flushall
 * Exact the same as flushdb because multiple db is not supported yet
 */
exports.flushall = flushdb;