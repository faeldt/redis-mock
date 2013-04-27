/*!
 * redis-mock
 * (c) 2012 Kristian Faeldt <faeldt_kristian@cyberagent.co.jp>
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 * Constructor
 */
var RedisItem = function (type) {
    EventEmitter.call(this);
    this.type = type||0;
    this.expires = -1;
    this.hash = {};
    this.list = [];
}
util.inherits(RedisItem, EventEmitter);

RedisItem.prototype.rpush = function(value) {
  this.list.push(value);
  this.emit('pushed');
};

RedisItem.prototype.lpush = function(value) {
  this.list.unshift(value);
  this.emit('pushed');
};

RedisItem.prototype.rpop = function(value) {
  var val = this.list.pop();
  this.emit('popped');
  return val;
};

RedisItem.prototype.lpop = function(value) {
  var val = this.list.shift();
  this.emit('popped');
  return val;
};

/**
 * Export the constructor
 */
module.exports = exports = RedisItem;
