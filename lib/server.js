/*!
 * redis-mock
 * (c) 2012 Kristian Faeldt <kristian.faeldt@gmail.com>
 */

/**
 * flushdb
 */
exports.flushdb = flushdb = function(mockInstance, callback) {
	mockInstance.storage = {};

	mockInstance._callCallback(callback, null, 'OK');
};

/**
 * flushall
 * Exact the same as flushdb because multiple db is not supported yet
 */
exports.flushall = flushdb;

/**
 * ping
 */
 exports.ping = function(mockInstance, callback) {
 	mockInstance._callCallback(callback, null, 'PONG');
 };

 /**
  * dbsize
  */
 exports.dbsize = function(mockInstance, callback) {
 	var size = 0;
 	mockInstance._callCallback(callback, null, size);
 };

exports.save = function(mockInstance, callback) {
	mockInstance._lastSave = Math.round( Date.now() / 1000 );
	mockInstance._callCallback(callback, null, 'OK');
};

exports.lastsave = function(mockInstance, callback) {
	var t = (mockInstance._lastSave !== 'undefined' ? mockInstance._lastSave : Date.now() - (5 * 1000));
	mockInstance._callCallback(callback, null, t);
};

exports.time = function(mockInstance, callback) {
	var dt = new Date();
	var t = [
		Math.round( dt / 1000 ),
		dt.getMilliseconds() * 1000
	];

	mockInstance._callCallback(callback, null, t);
};
