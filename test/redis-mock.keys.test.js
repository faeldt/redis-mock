var redismock = require("../"),
	should = require("should"),
	events = require("events");

describe("del", function () {

    it("should do nothing with non-existant keys", function (done) {

        var r = redismock.createClient("", "", "");

        r.del(["key1", "key2", "key3"], function (err, result) {

            result.should.equal(0);

            r.del("key4", function (err, result) {

                result.should.equal(0);

                r.end();

                done();

            });            

        });

    });

    it("should delete existing keys", function (done) {

        var r = redismock.createClient("", "", "");

        r.hset("test", "test", "test", function (err, result) {

            r.del("test", function (err, result) {

                result.should.equal(1);

                r.hget("test", "test", function (err, result) {

                    should.not.exist(result);

                    r.end();

                    done();

                });                

            });

        });

    });

    it("should delete multiple keys", function (done) {

        var r = redismock.createClient("", "", "");

        r.hset("test", "test", "test", function (err, result) {

            r.hset("test2", "test2", "test2", function (err, result) {

                r.del(["test", "test2", "noexistant"], function (err, result) {

                    result.should.equal(2);

                    r.end();

                    done();

                });

            });

        });

    });

});

describe("exists", function () {

    it("should return 0 for non-existing keys", function(done) {

        var r = redismock.createClient("", "", "");

        r.exists("test", function (err, result) {

            result.should.equal(0);

            r.end();

            done();

        });
    });

    it("should return 1 for existing keys", function (done) {

        var r = redismock.createClient("", "", "");

        r.hset("test", "test", "test", function (err, result) {

            r.exists("test", function (err, result) {

                result.should.equal(1);

                r.del("test");

                r.end();

                done();

            });

        });

    });

});

//TODO: test that keys persist over rename
//TODO: test that expire can update
//TODO: test persist
//TODO: test that expire clears when setting different value to key
describe("expire", function () {    

    it("should return 0 for non-existing key", function (done) {

        var r = redismock.createClient("", "", "");

        r.expire("test", 10, function (err, result) {

            result.should.equal(0);

            r.end();

            done();

        });

    });

    it("should return 1 when timeout set on existing key", function (done) {

        var r = redismock.createClient("", "", "");

        r.hset("test", "test", "test", function (err, result) {

            r.expire("test", 10, function (err, result) {

                result.should.equal(1);

                r.del("test");

                r.end();

                done();

            });

        });

    });

    it("should make key disappear after the set time", function (done) {

        var r = redismock.createClient("", "", "");

        r.hset("test", "test", "test", function (err, result) {

            r.expire("test", 1, function (err, result) {

                result.should.equal(1);

                setTimeout(function () {
                    console.log("Waiting for expire...");
                }, 1000);

                setTimeout(function () {

                    r.exists("test", function (err, result) {

                        result.should.equal(0);

                        r.end();

                        done();

                    });                    

                }, 2000);                

            });

        });

    });

});