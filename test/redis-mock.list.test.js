var redismock = require("../"),
  should = require("should"),
  events = require("events");

describe("basic pushing/poping list", function() {
    var testKey = "myKey";
    var testKey2 = "myKey2";
    var testValues = [1, 2, 3, 4, 5];
    var testValue = 10;

    it("should not get any value from the end", function(done) {

        var r = redismock.createClient("", "", "");

        r.rpop(testKey, function(err, result) {

            should.not.exist(result);

            r.end();

            done();
        });
    });

    it("should not get any value from the start", function(done) {

        var r = redismock.createClient("", "", "");

        r.lpop(testKey, function(err, result) {

            should.not.exist(result);

            r.end();

            done();
        });
    });

    it("should push and pop the same element on the end", function(done) {

        var r = redismock.createClient("", "", "");

        r.rpush(testKey, testValue, function(err, result) {

            result.should.equal(1);

            r.rpop(testKey, function(err, result) {

                result.should.equal(testValue);

                r.end();

                done();
            });
        });
    });

    it("should push and pop the same element on the start", function(done) {

        var r = redismock.createClient("", "", "");

        r.lpush(testKey, testValue, function(err, result) {

            result.should.equal(1);

            r.lpop(testKey, function(err, result) {

                result.should.equal(testValue);

                r.end();

                done();
            });
        });
    });

    it("should be a queue", function(done) {

        var r = redismock.createClient("", "", "");

        r.lpush(testKey, testValue, function(err, result) {

            result.should.equal(1);

            r.lpush(testKey, testValue + 1, function(err, result) {

                result.should.equal(2);

                r.rpop(testKey, function(err, result) {

                  result.should.equal(testValue);

                  r.end();

                  done();
                });
            });
        });
    });

    it("should add a few elements", function(done) {

        var r = redismock.createClient("", "", "");

        r.lpush(testKey2, testValues, function(err, result) {

            result.should.equal(testValues.length);

            r.lpop(testKey2, function(err, result) {

                result.should.equal(testValues[0]);

                r.rpop(testKey2, function(err, result) {

                  result.should.equal(testValues[testValues.length - 1]);

                  r.end();

                  done();
                });
            });
        });
    });
});

describe("llen", function() {
    var testKey = "myKey3";
    var testValues = [1, 2, 3, 4, 5];
    var testValue = 10;
    it("should return 0", function(done) {

        var r = redismock.createClient("", "", "");

        r.llen(testKey, function(err, result) {

            result.should.equal(0);

            r.end();

            done();
        });
    });

    it("should return 5 and evolve", function(done) {

        var r = redismock.createClient("", "", "");

        r.lpush(testKey, testValues, function(err, res) {

            r.llen(testKey, function(err, result) {

                result.should.equal(testValues.length);

                r.rpop(testKey, function(err, result) {

                    r.llen(testKey, function(err, result) {

                        result.should.equal(testValues.length - 1);

                        r.end();

                        done();
                    });
                });
            });
        });
    });

});
