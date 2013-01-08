var redismock = require("../"),
	should = require("should"),
	events = require("events");

describe("basic hashing function", function () {

    var testHash = "myHash";
    var testKey = "myKey";
    var testValue = "myValue";

    var testKeyNotExist = "myKeyNonExistant";

    it("should not say that non-existant values exist", function (done) {

        var r = redismock.createClient("", "", "");

        r.hexists(testHash, testKey, function (err, result) {

            result.should.equal(0);

            r.end();

            done();

        });

    });

    it("should set a value", function (done) {

        var r = redismock.createClient("", "", "");

        r.hset(testHash, testKey, testValue, function (err, result) {

            result.should.equal(1);

            r.end();

            done();

        });

    });

    it("should get a value that has been set", function (done) {

        var r = redismock.createClient("", "", "");

        r.hget(testHash, testKey, function (err, result) {

            result.should.equal(testValue);

            r.end();

            done();

        });

    });

    it("should not get a value that has not been set", function (done) {

        var r = redismock.createClient("", "", "");

        r.hget(testHash, testKeyNotExist, function (err, result) {

            should.not.exist(result);

            r.end();

            done();

        });

    });

    it("should say that set value exists", function (done) {

        var r = redismock.createClient("", "", "");

        r.hexists(testHash, testKey, function (err, result) {

            result.should.equal(1);

            r.end();

            done();

        });

    });

    it("should delete a value", function (done) {

        var r = redismock.createClient("", "", "");

        r.hdel(testHash, testKey, function (err, result) {

            result.should.equal(1);

            r.end();

            done();

        });

    });

    it("should not get a value that has been deleted", function (done) {

        var r = redismock.createClient("", "", "");

        r.hget(testHash, testKey, function (err, result) {

            should.not.exist(result);

            r.end();

            done();

        });

    });

    it("should not say that deleted value exists", function (done) {

        var r = redismock.createClient("", "", "");

        r.hexists(testHash, testKey, function (err, result) {

            result.should.equal(0);

            r.end();

            done();

        });

    });

});

describe("hsetnx", function () {

    var testHash = "myHash";
    var testKey = "myKey";
    var testValue = "myValue";
    var testValue2 = "myNewTestValue";

    it("should set a value that does not exist", function (done) {

        var r = redismock.createClient("", "", "");

        r.hsetnx(testHash, testKey, testValue, function (err, result) {

            result.should.equal(1);

            r.end();

            done();

        });

    });

    it("should not set a value that does exist", function (done) {

        var r = redismock.createClient("", "", "");

        r.hsetnx(testHash, testKey, testValue2, function (err, result) {

            result.should.equal(0);            

            r.hget(testHash, testKey, function (err, result) {

                result.should.not.equal(testValue2);

                result.should.equal(testValue);

                r.end();

                done();

            });            

        });

    });

});