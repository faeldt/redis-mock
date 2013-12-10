/*!
 * redis-mock
 * (c) 2013 Amsellem Yves <amsellem.yves@gmail.com>
 */
exports.multi = function (mockInstance, RedisClient) {

	var multiqueue = {
		_queue: [],
		exec: function(cb) {
			if(this._queue.length === 0) return;

			var lastcommand = this._queue.pop();
			var lastcallback = function() {
				lastcommand.args.push(cb);
				lastcommand.fn.apply(RedisClient, lastcommand.args);
			};

			if(this._queue.length === 1) {
				lastcallback();
			} else {
				this._queue.forEach(function(command) {
					var callback = lastcallback;
					lastcallback = function() {
						command.args.push(callback);
						command.fn.apply(RedisClient, command.args);
					};
				});
			}
		}
	};

	_keys(RedisClient.prototype, function(fn, method) {
		if(method !== 'multi' || method !== 'MULTI') {
			multiqueue[method] = function() {
				this._queue.push({method: method, fn: fn, args: Array.prototype.slice.call(arguments)});
			};
		}
	});

	return multiqueue;
}

_keys = function(array, iterator) {
	for (var item in array) {
		if(array.hasOwnProperty(item))
			iterator.call(null, array[item], item);
	}
}