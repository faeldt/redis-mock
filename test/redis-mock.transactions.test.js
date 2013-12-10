var redismock = require("../"),
    should = require("should"),
    events = require("events");

if (process.env['VALID_TESTS']) {
    redismock = require('redis');
}

describe("get", function () {

    it("should return the value of an existing key", function(done) {

        var r = redismock.createClient("", "", "");

        var multiqueue = r.multi();
        
        multiqueue.set("foo", "bar");

        multiqueue.set("foo", "baz");
        
        multiqueue.exec(function (err) {

            r.get("foo", function (err, result) {

                result.should.equal("baz");

                r.end();

                done();

            });
        });
    });
});