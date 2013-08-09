var redismock = require("../"),
    should = require("should"),
    events = require("events");

if (process.env['VALID_TESTS']) {
    redismock = require('redis');
}

describe("get", function () {

    it("should return the value of an existing key", function(done) {

        var r = redismock.createClient("", "", "");

        r.set("foo", "bar", function (err, result) {

            r.get("foo", function (err, result) {

                result.should.equal("bar");

                r.end();

                done();

            });

        });

    });

    it("should return null for a non-existing key", function (done) {

        var r = redismock.createClient("", "", "");


        r.get("does-not-exist", function (err, result) {

            should.not.exist(result);

            r.end();

            done();

        });


    });

});

describe("setex", function () {

    it("should set a key", function (done) {

        var r = redismock.createClient("", "", "");

        r.setex("test", 10000, "val", function (err, result) {

            result.should.be.ok;

            r.get("test", function(err, result) {
                result.should.equal("val");

                r.end();
                done();
            });

        });

    });

    it("should set a disappearing key", function (done) {

        var r = redismock.createClient("", "", "");

        r.setex("test", 1, "val", function (err, result) {

            result.should.be.ok;

            setTimeout(function () {
                console.log("Waiting for expire...");
            }, 1000);

            setTimeout(function () {

                r.exists("test", function (err, result) {

                    result.should.equal(0);

                    r.end();

                    done();

                });

            }, 2100);

        });

    });

});

describe("incr", function () {

    it("should increment the number stored at key", function (done) {

        var r = redismock.createClient("", "", "");

        r.set("foo", "10", function (err, result) {

            r.incr("foo", function (err, result) {

                result.should.eql(11);

                r.get("foo", function (err, result) {

                    result.should.eql("11");

                    r.end();
                    done();
                });
            });
        });
    });

    it("should set 0 before performing if the key does not exist", function (done) {

        var r = redismock.createClient("", "", "");

        r.incr("bar", function (err, result) {

            result.should.eql(1);

            r.get("bar", function (err, result) {

                result.should.eql("1");

                r.end();
                done();
            });
        });
    });

    it("should return error if the key holds the wrong kind of value.", function (done) {

        var r = redismock.createClient("", "", "");

        r.hset("foo", "bar", "baz", function (err, result) {

            r.incr("foo", function (err, result) {

                err.message.should.eql("ERR Operation against a key holding the wrong kind of value");

                r.end();
                done();
            });
        });
    });

    it("should return error if the key contains a string that can not be represented as integer.", function (done) {

        var r = redismock.createClient("", "", "");

        r.set("baz", "qux", function (err, result) {

            r.incr("baz", function (err, result) {

                err.message.should.equal("ERR value is not an integer or out of range");

                r.end();
                done();
            });
        });
    });
});
