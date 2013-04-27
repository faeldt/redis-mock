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

describe("lindex", function() {
    var testKey = "myKey4";
    var testKey2 = "myKey5";
    var keyUndefined = "keyUndefined";
    var testValues = [1, 2, 3, 4, 5];

    it("getting index of non exisiting list", function(done) {

        var r = redismock.createClient("", "", "");

        r.lindex(keyUndefined, 0, function(err, result) {

            should.not.exist(result);

            r.lindex(keyUndefined, 12, function(err, result) {

                should.not.exist(result);

                r.end();

                done();
            });
        });
    });

    it("getting positive indexes of exisiting list", function(done) {

        var r = redismock.createClient("", "", "");

        r.lpush(testKey, testValues, function(err, result) {

            r.lindex(testKey, testValues.length, function(err, result) {

                should.not.exist(result);

                r.lindex(testKey, 0, function(err, result) {

                    result.should.equal(testValues[0]);

                    r.lindex(testKey, testValues.length - 1, function(err, result) {

                        result.should.equal(testValues[testValues.length - 1]);

                        r.end();

                        done();
                    });
                });
            });
        });
    });

    it("getting negative indexes of exisiting list", function(done) {

        var r = redismock.createClient("", "", "");

        r.lpush(testKey2, testValues, function(err, result) {

            r.lindex(testKey2, -(testValues.length + 1), function(err, result) {

                should.not.exist(result);

                r.lindex(testKey2, -1, function(err, result) {

                    result.should.equal(testValues[testValues.length - 1]);

                    r.lindex(testKey2, -testValues.length, function(err, result) {

                        result.should.equal(testValues[0]);

                        r.end();

                        done();
                    });
                });
            });
        });
    });
});

describe("lset", function() {

    var testKey = "myKey4";
    var testKey2 = "myKey5";
    var testKey3 = "myKey6";
    var testKey4 = "myKey7";
    var keyUndefined = "keyUndefined";
    var keyUndefined2 = "keyUndefined2";
    var testValues = [1, 2, 3, 4, 5];

    it("changing value of non exisiting list", function(done) {

        var r = redismock.createClient("", "", "");

        r.lset(keyUndefined, 0, 1, function(err, result) {

            result.should.equal("ERR no such key");

            r.end();

            done();
        });
    });

    it("setting impossible indexes", function(done) {

        var r = redismock.createClient("", "", "");

        r.lpush(keyUndefined2, testValues, function(err, result) {

            r.lset(keyUndefined2, testValues.length + 1, 3, function(err, result) {

                result.should.equal("ERR index out of range");

                r.lset(keyUndefined2, -(testValues.length + 2), 3, function(err, result) {

                    result.should.equal("ERR index out of range");

                    r.end();

                    done();
                });
            });
        });
    });

    it("changing value positive indexes from start index 0", function(done) {

        var r = redismock.createClient("", "", "");

        r.lpush(testKey, testValues, function(err, result) {

            r.lset(testKey, 0, 3, function(err, result) {

                result.should.equal("OK");

                r.lindex(testKey, 0, function(err, result) {

                    result.should.equal(3);

                    r.end();

                    done();
                });
            });
        });
    });

    it("changing value positive indexes from start index length-1", function(done) {

        var r = redismock.createClient("", "", "");

        r.lpush(testKey2, testValues, function(err, result) {

            r.lset(testKey2, testValues.length - 1, 3, function(err, result) {

                result.should.equal("OK");

                r.lindex(testKey2, testValues.length - 1, function(err, result) {

                    result.should.equal(3);

                    r.end();

                    done();
                });
            });
        });
    });

    it("changing value negative indexes of exisiting list index -1", function(done) {

        var r = redismock.createClient("", "", "");

        r.lpush(testKey3, testValues, function(err, result) {

            r.lset(testKey3, -1, 42, function(err, result) {

                result.should.equal("OK");

                r.lindex(testKey3, -1, function(err, result) {

                    result.should.equal(42);

                    r.end();

                    done();
                });
            });
        });
    });

    it("changing value negative indexes of exisiting list index -length", function(done) {

        var r = redismock.createClient("", "", "");

        r.lpush(testKey4, testValues, function(err, result) {

            r.lset(testKey4, -testValues.length, 45, function(err, result) {

                result.should.equal("OK");

                r.lindex(testKey4, 0, function(err, result) {

                    result.should.equal(45);

                    r.end();

                    done();
                });
            });
        });
    });
});
