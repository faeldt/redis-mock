/*!
 * redis-mock
 * (c) 2012 Kristian Faeldt <faeldt_kristian@cyberagent.co.jp>
 */

/**
 * Constructor
 */
var RedisItem = function (type) {

    this.type = type||0;
    this.expires = -1;
    this.hash = {};
    this.list = [];
}

/**
 * Export the constructor
 */
module.exports = exports = RedisItem;
