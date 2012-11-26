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

