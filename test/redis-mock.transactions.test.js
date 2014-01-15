var redismock = require("../"),
    should = require("should"),
    events = require("events");

if (process.env['VALID_TESTS']) {
    redismock = require('redis');
}

describe("transactions", function () {

    it("should be empty", function(done) {

        var r = redismock.createClient("", "", "");
        r.multi().exec(function (err) {
            should.not.exist(err);
            done();
        });
    });

    it("should be simple", function(done) {

        var r = redismock.createClient("", "", "");

        var multiqueue = r.multi();
        multiqueue = multiqueue.set("foo", "baz");
        multiqueue.exec(function (err) {

            r.get("foo", function (err, result) {
                should.not.exist(err);
                result.should.equal("baz");
                r.end();
                done();
            });
        });
    });

    it("should be multiple", function(done) {

        var r = redismock.createClient("", "", "");

        var multiqueue = r.multi();
        multiqueue.set("foo", "baz");
        multiqueue.set("foo", "bar");
        multiqueue.set("fool", "bal");
        //multiqueue.get("foo");
        multiqueue.exec(function (err) {

            r.get("foo", function (err, result) {
                should.not.exist(err);
                result.should.equal("bar");
                r.end();
                done();
            });
        });
    });

    it("should return multiple results", function(done) {
        
        var r = redismock.createClient("", "", "");

        // start a separate multi command queue
        multi = r.multi();
        multi.incr("incr thing");
        multi.incr("incr other thing");

        // runs immediately
        r.set("incr thing", 100);
        r.set("incr other thing", 1);

        // drains multi queue and runs atomically
        multi.exec(function (err, replies) {
            should.not.exist(err);
            replies.length.should.equal(2);
            replies[0].should.equal(101);
            replies[1].should.equal(2);
            r.end();
            done();
        });
    });
});
