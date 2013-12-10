/*!
 * redis-mock
 * (c) 2013 Amsellem Yves <amsellem.yves@gmail.com>
 */
exports.multi = function (mockInstance, RedisClient) {

	var multiqueue = {
		_queue: [],
		exec: function(cb) {
			if(this._queue.length === 0) return cb();

			var callback = _cb(this._queue.pop(), cb);

			if(this._queue.length > 0) {
				this._queue.forEach(function(command) {
					_cb(command, callback)
				});
			}
			callback();
		}
	};

	_fnAndNames(RedisClient.prototype, function(fn, fnName) {
		if(fnName !== 'multi' || fnName !== 'MULTI') {
			multiqueue[fnName] = function() {
				this._queue.push({
					fnName: fnName, 
					fn: fn, 
					args: Array.prototype.slice.call(arguments)
				});
				return multiqueue;
			};
		}
	});

	return multiqueue;
}

_cb = function(command, cb) {
	return function() {
		command.args.push(cb);
		command.fn.apply(null, command.args);
	}
}

_fnAndNames = function(array, iterator) {
	for (var item in array) {
		if(array.hasOwnProperty(item))
			iterator.call(null, array[item], item);
	}
}