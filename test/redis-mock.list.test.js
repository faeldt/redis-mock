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

        var cb = function(err, result) {

            result.should.equal(testValues.length);

            r.lpop(testKey2, function(err, result) {

                result.should.equal(testValues[testValues.length - 1]);

                r.rpop(testKey2, function(err, result) {

                  result.should.equal(testValues[0]);

                  r.end();

                  done();
                });
            });
        };
        r.lpush.apply(r, [testKey2].concat(testValues, cb));
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

        var cb = function(err, res) {

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
        };
        r.lpush.apply(r, [testKey].concat(testValues, cb));
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

        var cb = function(err, result) {

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
        };
        r.rpush.apply(r, [testKey].concat(testValues, cb));
    });

    it("getting negative indexes of exisiting list", function(done) {

        var r = redismock.createClient("", "", "");

        var cb = function(err, result) {

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
        };
        r.rpush.apply(r, [testKey2].concat(testValues, cb));
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

        var cb = function(err, result) {

            r.lset(keyUndefined2, testValues.length + 1, 3, function(err, result) {

                result.should.equal("ERR index out of range");

                r.lset(keyUndefined2, -(testValues.length + 2), 3, function(err, result) {

                    result.should.equal("ERR index out of range");

                    r.end();

                    done();
                });
            });
        };
        r.rpush.apply(r, [keyUndefined2].concat(testValues, cb));
    });

    it("changing value positive indexes from start index 0", function(done) {

        var r = redismock.createClient("", "", "");

        var cb = function(err, result) {

            r.lset(testKey, 0, 3, function(err, result) {

                result.should.equal("OK");

                r.lindex(testKey, 0, function(err, result) {

                    result.should.equal(3);

                    r.end();

                    done();
                });
            });
        };
        r.rpush.apply(r, [testKey].concat(testValues, cb));
    });

    it("changing value positive indexes from start index length-1", function(done) {

        var r = redismock.createClient("", "", "");

        var cb = function(err, result) {

            r.lset(testKey2, testValues.length - 1, 3, function(err, result) {

                result.should.equal("OK");

                r.lindex(testKey2, testValues.length - 1, function(err, result) {

                    result.should.equal(3);

                    r.end();

                    done();
                });
            });
        };
        r.rpush.apply(r, [testKey2].concat(testValues, cb));
    });

    it("changing value negative indexes of exisiting list index -1", function(done) {

        var r = redismock.createClient("", "", "");

        var cb = function(err, result) {

            r.lset(testKey3, -1, 42, function(err, result) {

                result.should.equal("OK");

                r.lindex(testKey3, -1, function(err, result) {

                    result.should.equal(42);

                    r.end();

                    done();
                });
            });
        };
        r.rpush.apply(r, [testKey3].concat(testValues, cb));
    });

    it("changing value negative indexes of exisiting list index -length", function(done) {

        var r = redismock.createClient("", "", "");

        var cb = function(err, result) {

            r.lset(testKey4, -testValues.length, 45, function(err, result) {

                result.should.equal("OK");

                r.lindex(testKey4, 0, function(err, result) {

                    result.should.equal(45);

                    r.end();

                    done();
                });
            });
        };
        r.rpush.apply(r, [testKey4].concat(testValues, cb));
    });
});


describe("rpushx", function (argument) {
    var testKey = "myKey8";

    it("tries to push on empty list", function(done) {

        var r = redismock.createClient("", "", "");

        r.rpushx(testKey, 3, function(err, result) {

            result.should.equal(0);

            r.lindex(testKey, 0, function(err, result) {

                should.not.exist(result);

                r.end();

                done();
            });
        });
    });

    it("tries to push on non empty list", function(done) {

        var r = redismock.createClient("", "", "");

        r.rpush(testKey, 3, function(err, result) {

            r.rpushx(testKey, 5, function(err, result) {

                result.should.equal(2);

                r.lindex(testKey, 1, function(err, result) {

                    result.should.equal(5);

                    r.end();

                    done();
                });
            });
        });
    });
});

describe("lpushx", function (argument) {
    var testKey = "myKey9";

    it("tries to push on empty list", function(done) {

        var r = redismock.createClient("", "", "");

        r.lpushx(testKey, 3, function(err, result) {

            result.should.equal(0);

            r.lindex(testKey, 0, function(err, result) {

                should.not.exist(result);

                r.end();

                done();
            });
        });
    });

    it("tries to push on non empty list", function(done) {

        var r = redismock.createClient("", "", "");

        r.rpush(testKey, 3, function(err, result) {

            r.lpushx(testKey, 5, function(err, result) {

                result.should.equal(2);

                r.lindex(testKey, 0, function(err, result) {

                    result.should.equal(5);

                    r.end();

                    done();
                });
            });
        });
    });
});

describe("brpop", function() {
    it("should block until the end of the timeout", function(done) {

        var r = redismock.createClient("", "", "");
        var time = false;

        r.brpop("foo", 500, function(err, result) {

            console.log("Waiting for timeout...");
            should.not.exist(result);
            time.should.equal(true);
            done();
        });

        setTimeout(function() {time = true}, 400);
    });

    it("should block until the end of the timeout even with multiple lists", function(done) {
        var r = redismock.createClient("", "", "");
        var time = false;
        console.log("Waiting for timeout...");

        r.brpop("foo", "ffo", 500, function(err, result) {

            should.not.exist(result);
            time.should.equal(true);
            done();
        });

        setTimeout(function() {time = true}, 400);
    });

    it("should block with empty list too", function(done) {
        var r = redismock.createClient("", "", "");
        r.rpush("foo2", "bar", function(err, result) {

            r.rpop("foo2", function(err, result) {

              var time = false;
              console.log("Waiting for timeout...");

              r.brpop("foo2", "ffo2", 500, function(err, result) {

                  should.not.exist(result);
                  time.should.equal(true);
                  done();
              });

              setTimeout(function() {time = true}, 400);
            });
        });
    });

    it("should unblock when an element is added", function(done) {
        var r = redismock.createClient("", "", "");
        var time = false;
        console.log("Waiting for pop...");

        r.brpop("foo3", 500, function(err, result) {

            result[0].should.equal("foo3");
            result[1].should.equal("bar");
            time.should.equal(true);
            done();
        });

        setTimeout(function() {time = true}, 200);

        setTimeout(function() {
            r.rpush("foo3", "bar");
        }, 300);
    });

    it("should unblock when an element is added to any list", function(done) {
        var r = redismock.createClient("", "", "");
        var time = false;
        console.log("Waiting for pop...");

        r.brpop("foo3", "foo4", 500, function(err, result) {

            result[0].should.equal("foo4");
            result[1].should.equal("bim");
            time.should.equal(true);
            done();
        });

        setTimeout(function() {time = true}, 200);

        setTimeout(function() {
            r.rpush("foo4", "bim");
        }, 300);
    });

    it("push with multiple elements should be condired as one", function(done) {
        var r = redismock.createClient("", "", "");
        var time = false;
        console.log("Waiting for pop...");

        r.brpop("foo5", 500, function(err, result) {

            result[0].should.equal("foo5");
            result[1].should.equal("bam");
            time.should.equal(true);
            done();
        });

        setTimeout(function() {time = true}, 200);

        setTimeout(function() {
            r.rpush("foo5", "bim", "bam");
        }, 300);
    });

    it("should once it's unblocked it shouldn't be called again", function(done) {
        var r = redismock.createClient("", "", "");
        var called = 0;
        console.log("Waiting for pop...");
        r.brpop("foo6", "foo7", 500, function(err, result) {

            called += 1;
        });

        setTimeout(function() {
            r.rpush("foo6", "bim");
            r.rpush("foo7", "bam");
        }, 300);

        setTimeout(function() {
            called.should.equal(1);
            done();
        }, 500);
    });
});

describe("blpop", function() {
    it("should block until the end of the timeout", function(done) {

        var r = redismock.createClient("", "", "");
        var time = false;

        r.blpop("foo8", 500, function(err, result) {

            console.log("Waiting for timeout...");
            should.not.exist(result);
            time.should.equal(true);
            done();
        });

        setTimeout(function() {time = true}, 400);
    });

    it("should block until the end of the timeout even with multiple lists", function(done) {
        var r = redismock.createClient("", "", "");
        var time = false;
        console.log("Waiting for timeout...");

        r.blpop("foo9", "ffo9", 500, function(err, result) {

            should.not.exist(result);
            time.should.equal(true);
            done();
        });

        setTimeout(function() {time = true}, 400);
    });

    it("should block with empty list too", function(done) {
        var r = redismock.createClient("", "", "");
        r.rpush("foo10", "bar", function(err, result) {

            r.rpop("foo10", function(err, result) {

              var time = false;
              console.log("Waiting for timeout...");

              r.blpop("foo10", "ffo10", 500, function(err, result) {

                  should.not.exist(result);
                  time.should.equal(true);
                  done();
              });

              setTimeout(function() {time = true}, 400);
            });
        });
    });

    it("should unblock when an element is added", function(done) {
        var r = redismock.createClient("", "", "");
        var time = false;
        console.log("Waiting for pop...");

        r.blpop("foo11", 500, function(err, result) {

            result[0].should.equal("foo11");
            result[1].should.equal("bar");
            time.should.equal(true);
            done();
        });

        setTimeout(function() {time = true}, 200);

        setTimeout(function() {
            r.rpush("foo11", "bar");
        }, 300);
    });

    it("should unblock when an element is added to any list", function(done) {
        var r = redismock.createClient("", "", "");
        var time = false;
        console.log("Waiting for pop...");

        r.blpop("foo12", "foo13", 500, function(err, result) {

            result[0].should.equal("foo12");
            result[1].should.equal("bim");
            time.should.equal(true);
            done();
        });

        setTimeout(function() {time = true}, 200);

        setTimeout(function() {
            r.rpush("foo12", "bim");
        }, 300);
    });

    it("push with multiple elements should be condired as one", function(done) {
        var r = redismock.createClient("", "", "");
        var time = false;
        console.log("Waiting for pop...");

        r.blpop("foo14", 500, function(err, result) {

            result[0].should.equal("foo14");
            result[1].should.equal("bam");
            time.should.equal(true);
            done();
        });

        setTimeout(function() {time = true}, 200);

        setTimeout(function() {
            r.lpush("foo14", "bim", "bam");
        }, 300);
    });

    it("should once it's unblocked it shouldn't be called again", function(done) {
        var r = redismock.createClient("", "", "");
        var called = 0;
        console.log("Waiting for pop...");
        r.blpop("foo15", "foo16", 500, function(err, result) {

            called += 1;
        });

        setTimeout(function() {
            r.rpush("foo15", "bim");
            r.rpush("foo16", "bam");
        }, 300);

        setTimeout(function() {
            called.should.equal(1);
            done();
        }, 500);
    });
});
