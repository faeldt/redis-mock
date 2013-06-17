var redismock = require("../"),
    should = require("should"),
    events = require("events");

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

describe("incr", function () {

    it("should increment number", function(done) {

        var r = redismock.createClient("", "", "");

        r.set("foo", "10", function (err, result) {

            r.incr("foo", function (err, result) {

                result.should.eql(11);

                r.get("foo", function (err, result) {

                    result.should.eql("11");

                    done();

                });

            });

        });

    });


    it("should set 0 before performing if key does not exist", function(done) {

        var r = redismock.createClient("", "", "");

        r.incr("bar", function (err, result) {

            result.should.eql(1);

            r.get("bar", function (err, result) {

                console.log(typeof result);

                result.should.eql("1");

                done();

            });

        });

    });

});