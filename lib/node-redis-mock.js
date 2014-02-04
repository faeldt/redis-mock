/*!
 * redis-mock
 * (c) 2012 Kristian Faeldt <kristian.faeldt@gmail.com>
 */

/*jshint node: true */
'use strict';

/**
 * Module dependencies
 */
var events = require("events"),
    util = require("util");

/**
 * RedisMock constructor
 */
function RedisMock() {

    this.storage = {};

    var self = this;

    this._expireCheck = function () {

        var found = false;
        for (var s in self.storage) {

            if (self.storage[s].expires > 0) {
                self.storage[s].expires--;
                found = true;
            }
            else if (self.storage[s].expires === 0) {
                delete self.storage[s];
                found = true;
            }
        }

        if (!found) {
            self._toggleExpireCheck(false);
        }
    };

    this._toggleExpireCheck = function (toggle) {

        if (!toggle) {
            if (this._expireLoop) {
                clearInterval(this._expireLoop);
                this._expireLoop = null;
            }
        }
        else {

            if (!this._expireLoop) {
                this._expireLoop = setInterval(this._expireCheck, 1000);
            }

        }

    };

    /**
     * Helper function to launch the callback(err, reply)
     * on the next process tick
     */
    this._callCallback = function(callback, err, result) {
        if (callback) {
            process.nextTick(function () {
                callback(err, result);
            });
        }
    };
}

/**
 * RedisMock inherits from EventEmitter to be mock pub/sub
 */
util.inherits(RedisMock, events.EventEmitter);

/*
 * Create RedisMock instance and export
 */
var MockInstance = new RedisMock();
module.exports = exports = MockInstance;

/**
 * RedisClient constructor
 */
function RedisClient(stream, options) {

    var self = this;

    this.pub_sub_mode = false;

    // We always listen for 'message', even if this is not a subscription client.
    // We will only act on it, however, if the channel is in this.subscriptions, which is populated through subscribe
    this._message = function (ch, msg) {

        if (ch in self.subscriptions && self.subscriptions[ch] === true) {
            self.emit('message', ch, msg);
        }
    }

    MockInstance.on('message', this._message);

    // Pub/sub subscriptions
    this.subscriptions = [];

    process.nextTick(function () {

        self.emit("ready");
        self.emit("connect");

    });
}

/*
 * RedisClient inherits from EventEmitter
 */
util.inherits(RedisClient, events.EventEmitter);

/**
 * Export the RedisClient constructor
 */
RedisMock.prototype.RedisClient = RedisClient;

/**
 * End
 */
RedisClient.prototype.end = function () {

    var self = this;

    // Remove all subscriptions (pub/sub)
    this.subscriptions = [];

    //Remove listener from MockInstance to avoid 'too many subscribers errors'
    MockInstance.removeListener('message', this._message);

    // TODO: Anything else we need to clear?

    process.nextTick(function () {

        self.emit("end");
    });

}

/**
 * Quit
 */
RedisClient.prototype.quit = RedisClient.prototype.end;

/**
 * Publish / subscribe / unsubscribe
 */
var pubsub = require("./pubsub.js");
RedisClient.prototype.subscribe = pubsub.subscribe;
RedisClient.prototype.unsubscribe = pubsub.unsubscribe;
RedisClient.prototype.publish = function (channel, msg) {
    pubsub.publish.call(this, MockInstance, channel, msg);
}

/**
 * Set up API to pass through to the library calls.
 **/
var CMD_FACTORY = {
  key: {
    lib: require('./keys.js'),
    commands: [ 'del', 'exists', 'expire', 'keys' ]
  },
  string: {
    lib: require('./strings.js'),
    commands: [ 'get', 'set', 'incr', 'setex', 'setnx' ]
  },
  hash: {
    lib: require('./hash.js'),
    commands: [ 'hget', 'hexists', 'hdel', 'hset', 'hincrby', 'hsetnx', 'hlen', 'hkeys', 'hgetall', 'hmset', 'hmget' ]
  },
  list: {
    lib: require('./list.js'),
    commands: [ 'llen', 'lpush', 'rpush', 'lpushx', 'rpushx', 'lpop', 'rpop', 'brpop', 'blpop', 'lindex', 'lset', 'rpoplpush', 'lrange' ]
  },
  set: {
    lib: require('./set.js'),
    commands: [ 'sadd', 'srem', 'smembers', 'scard' ]
  },
  sortedset: {
    lib: require('./sortedset.js'),
    commands: [ 'zadd', 'zrem', 'zcard', 'zrange', 'zrevrange', 'zrank', 'zrevrank' ]
  },
  server: {
    lib: require('./server.js'),
    commands: [ 'flushdb', 'flushall', 'ping', 'dbsize', 'save', 'lastsave', 'time' ]
  }
};

Object.keys(CMD_FACTORY).forEach(function (k) {
  CMD_FACTORY[k].commands.forEach(function(cmd) {
    RedisClient.prototype[cmd] = function(args, callback) {
      if (Array.isArray(args) && typeof callback === "function") {
        args.push(callback);
      } else {
        args = Array.prototype.slice.call(arguments);
      }
      args.unshift(MockInstance);
      CMD_FACTORY[k].lib[cmd].apply(this, args);
    };
    RedisClient.prototype[cmd.toUpperCase()] = RedisClient.prototype[cmd];
  });
});

/**
 * Transaction functions
 */
 var transactionfunctions = require("./transactions.js");

RedisClient.prototype.multi = RedisClient.prototype.MULTI = function() {
  return transactionfunctions.multi.call(this, MockInstance, RedisClient);
}

/**
 * RedisClient instance
 */

RedisMock.prototype.createClient = function (port_arg, host_arg, options) {
    return new RedisClient();
}
