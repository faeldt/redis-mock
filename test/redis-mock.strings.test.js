var redismock = require("../")
var should = require("should")
var events = require("events")
var sinon = require('sinon')

if (process.env['VALID_TESTS']) {
  redismock = require('redis');
}

describe("get", function () {

  it("should return the value of an existing key", function (done) {

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

  var clock, r;

  before(function () {
    clock = sinon.useFakeTimers();
  });

  beforeEach(function () {
    // speed up tests with fake timers. See http://sinonjs.org/docs/#clock-api
    r = redismock.createClient("", "", "");
  });

  after(function () {
    clock.restore()
  });

  it("should set a key", function (done) {
    var key = 'test_persist'
    r.setex(key, 1000, "val", function (err, result) {
      result.should.be.ok;
      r.get(key, function (err, result) {
        result.should.equal("val");
        r.end();
        done();
      });
    });
  });

  it("should set a disappearing key", function (done) {
    var key = 'test_disappearing'
    r.setex(key, 1, "val", cb)

    function cb(err, result) {
      result.should.be.ok;
      
      clock.tick(1000);

      setTimeout(function () {
        r.exists(key, function (err, result) {
          result.should.equal(0);
          r.end();
          done();
        });
      }, 2100);

      clock.tick(3000);
    }
  });

});

describe("setnx", function () {

  it("should set a key", function (done) {

    var r = redismock.createClient("", "", "");

    r.setnx("foo", "10", function (err, result) {
        result.should.eql(1);

      r.get("foo", function (err, result) {
        result.should.eql("10");
        r.end();
        done();
      });
    });
  });

  it("should not re-set a key", function (done) {

    var r = redismock.createClient("", "", "");

    r.set("foo", "val", function (err, result) {

      r.setnx("foo", "otherVal", function (err, result) {

        result.should.eql(0);

        r.get("foo", function(err, result) {
            result.should.equal("val");

            r.end();
            done();
        });
      });
    });
  });
});

describe("mget", function () {

  it("should fetch multiple values across multiple keys", function (done) {

    var r = redismock.createClient("", "", "");

    r.set("multi1", "one", function (err, result) {

      r.set("multi3", "three", function (err, result) {

        r.mget("multi1", "multi2", "multi3", function (err, result) {
          result.should.be.ok;

          result[0].should.equal("one");

          should.not.exist(result[1]);

          result[2].should.equal("three");

          r.end();
          done();
        });

      });
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

describe("incrbyfloat", function () {

  it("should increment the number stored at key by a float value", function (done) {

    var r = redismock.createClient("", "", "");

    r.set("foo", "1.5", function (err, result) {

      r.incrbyfloat("foo", "0.5", function (err, result) {

        result.should.eql(2);

        r.get("foo", function (err, result) {

          result.should.eql("2");

          r.end();
          done();
        });
      });
    });
  });

  it("should set 0 before performing if the key does not exist", function (done) {

    var r = redismock.createClient("", "", "");

    r.incrbyfloat("bar", "1.5", function (err, result) {

      result.should.eql(1.5);

      r.get("bar", function (err, result) {

        result.should.eql("1.5");

        r.end();
        done();
      });
    });
  });

  it("should return error if the key holds the wrong kind of value.", function (done) {

    var r = redismock.createClient("", "", "");

    r.hset("foo", "bar", "baz", function (err, result) {

      r.incrbyfloat("foo", "1.5", function (err, result) {

        err.message.should.eql("ERR Operation against a key holding the wrong kind of value");

        r.end();
        done();
      });
    });
  });

  it("should return error if the key contains a string that can not be represented as float.", function (done) {

    var r = redismock.createClient("", "", "");

    r.set("baz", "qux", function (err, result) {

      r.incrbyfloat("baz", "1.5",function (err, result) {

        err.message.should.equal("ERR value is not an float or out of range");

        r.end();
        done();
      });
    });
  });
});
