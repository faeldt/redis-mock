/*!
 * redis-mock
 * (c) 2012 Kristian Faeldt <faeldt_kristian@cyberagent.co.jp>
 */

/**
 * Module dependencies
 */
var events = require("events"),
    util = require("util");

/**
 * RedisMock constructor
 */
function RedisMock() {

	this.hash = {};
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

	    if (ch in self.subscriptions && self.subscriptions[ch] == true) {
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
 * Publish / subscribe / unsubscribe
 */
var pubsub = require("./pubsub.js");
RedisClient.prototype.subscribe = pubsub.subscribe;
RedisClient.prototype.unsubscribe = pubsub.unsubscribe;
RedisClient.prototype.publish = function (channel, msg) {
    pubsub.publish.call(this, MockInstance, channel, msg);
}

/**
 * Hashing functions
 */
var hashing = require("./hash.js");
 RedisClient.prototype.hget = RedisClient.prototype.HGET = function(hash, key, callback) {
 
     hashing.hget.call(this, MockInstance, hash, key, callback);
 }
RedisClient.prototype.hexists = RedisClient.prototype.HEXISTS = function (hash, key, callback) {
    
    hashing.hexists.call(this, MockInstance, hash, key, callback);
}
RedisClient.prototype.hdel = RedisClient.prototype.HDEL = function(hash, key, callback) {

    hashing.hdel.call(this, MockInstance, hash, key, callback);
}
RedisClient.prototype.hset = RedisClient.prototype.HSET = function(hash, key, value, callback) {

    hashing.hset.call(this, MockInstance, hash, key, value, callback);
}
RedisClient.prototype.hsetnx = RedisClient.prototype.HSETNX = function(hash, key, value, callback) {

    hashing.hsetnx.call(this, MockInstance, hash, key, value, callback);
}

RedisMock.prototype.createClient = function (port_arg, host_arg, options) {

  return new RedisClient();
}
