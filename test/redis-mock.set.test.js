var redismock = require('../')
  , should = require('should');

if (process.env['VALID_TESTS']) {
  redismock = require('redis');
}

describe('sadd', function () {

  it('should add a member to the set', function (done) {
    var r = redismock.createClient();
    r.sadd('foo', 'bar', function (err, result) {
      result.should.eql(1);

      r.smembers('foo', function (err, result) {
        result.should.eql(['bar']);

        r.end();
        done();
      });
    });
  });

  it('should add members to the set', function (done) {
    var r = redismock.createClient();
    r.sadd('foo', 'bar', 'baz', 'qux', function (err, result) {
      result.should.eql(3);

      r.smembers('foo', function (err, result) {
        result.should.containEql('bar');
        result.should.containEql('baz');
        result.should.containEql('qux');
        result.should.have.length(3);

        r.end();
        done();
      });
    });
  });

  it('should ignore members that are already a member of the set', function (done) {
    var r = redismock.createClient();
    r.sadd('foo', 'bar', 'bar', 'baz', function (err, result) {
      result.should.eql(2);

      r.sadd('foo', 'baz', function (err, result) {
        result.should.eql(0);

        r.smembers('foo', function (err, result) {
          result.should.containEql('bar');
          result.should.containEql('baz');
          result.should.have.length(2);

          r.end();
          done();
        });
      });
    });
  });

  it('should return error when the value stored at the key is not a set', function (done) {
    var r = redismock.createClient();

    r.hset('foo', 'bar', 'baz', function (err, result) {

      r.sadd('foo', 'bar', function (err, result) {
        err.message.should.eql('WRONGTYPE Operation against a key holding the wrong kind of value');

        r.end();
        done();
      });
    });
  });

  it('should support arguments without callback', function (done) {
    var r = redismock.createClient();
    r.sadd('foo', 'bar', 'baz');
    r.smembers('foo', function (err, result) {
      result.should.containEql('bar');
      result.should.containEql('baz');
      result.should.have.length(2);

      r.end();
      done();
    });
  });

});

describe('srem', function () {

  it('should remove a member from the set', function (done) {
    var r = redismock.createClient();
    r.sadd('foo', 'bar', 'baz', 'qux', function (err, result) {

      r.srem('foo', 'bar', function (err, result) {
        result.should.eql(1);

        r.smembers('foo', function (err, result) {
          result.should.not.containEql('bar');
          result.should.containEql('baz');
          result.should.containEql('qux');
          result.should.have.length(2);

          r.end();
          done();
        });
      });
    });
  });

  it('should remove members from the set', function (done) {
    var r = redismock.createClient();
    r.sadd('foo', 'bar', 'baz', 'qux', function (err, result) {

      r.srem('foo', 'bar', 'baz', function (err, result) {
        result.should.eql(2);

        r.smembers('foo', function (err, result) {
          result.should.not.containEql('bar');
          result.should.not.containEql('baz');
          result.should.containEql('qux');
          result.should.have.length(1);

          r.end();
          done();
        });
      });
    });
  });

  it('should ignore members that are not a member of the set', function (done) {
    var r = redismock.createClient();
    r.sadd('foo', 'bar', function (err, result) {

      r.srem('foo', 'bar', 'baz', function (err, result) {
        result.should.eql(1);

        r.smembers('foo', function (err, result) {
          result.should.eql([]);

          r.end();
          done();
        });
      });
    });
  });

  it('should return 0 if the key does not exist', function (done) {
    var r = redismock.createClient();
    r.sadd('foo', 'bar', function (err, result) {

      r.srem('baz', 'qux', function (err, result) {
        result.should.eql(0);

        r.end();
        done();
      });
    });
  });

  it('should return error when the value stored at the key is not a set', function (done) {
    var r = redismock.createClient();

    r.hset('foo', 'bar', 'baz', function (err, result) {

      r.srem('foo', 'bar', function (err, result) {
        err.message.should.eql('WRONGTYPE Operation against a key holding the wrong kind of value');

        r.end();
        done();
      });
    });
  });

  it('should support arguments without callback', function (done) {
    var r = redismock.createClient();
    r.sadd('foo', 'bar', 'baz', function (err, result) {
      r.srem('foo', 'bar', 'baz');
      r.smembers('foo', function (err, result) {
        result.should.not.containEql('bar');
        result.should.not.containEql('baz');
        result.should.have.length(0);

        r.end();
        done();
      });
    });
  });

});

// TODO: Add tests of SMEMBERS

describe('scard', function () {

  it('should return the number of elements', function (done) {
    var r = redismock.createClient();
    r.sadd('foo', 'bar', 'baz', function (err, result) {
      r.scard('foo', function (err, result) {
        result.should.eql(2);
        r.end();
        done();
      });
    });
  });

  it('should return 0 if key does not exist', function (done) {
    var r = redismock.createClient();
    r.sadd('foo', 'bar', 'baz', function (err, result) {
      r.scard('qux', function (err, result) {
        result.should.eql(0);
        r.end();
        done();
      });
    });
  });

  it('should return error when the value stored at the key is not a set', function (done) {
    var r = redismock.createClient();
    r.hset('foo', 'bar', 'baz', function (err, result) {
      r.scard('foo', function (err, result) {
        err.message.should.eql('WRONGTYPE Operation against a key holding the wrong kind of value');
        r.end();
        done();
      });
    });
  });

});

describe('sismember', function () {

  it('should return 1 if the value exists in the set', function (done) {
    var r = redismock.createClient();
    r.sadd('foo', 'bar', function (err, result) {
      r.sismember('foo', 'bar', function (err, result) {
        result.should.eql(1);
        r.end();
        done();
      });
    });
  });

  it('should return 0 if the value does not exist in the set', function (done) {
    var r = redismock.createClient();
    r.sadd('foo', 'bar', function (err, result) {
      r.sismember('foo', 'boo', function (err, result) {
        result.should.eql(0);
        r.end();
        done();
      });
    });
  });

  it('should return 0 if key does not exist', function (done) {
    var r = redismock.createClient();
    r.sadd('foo', 'bar', 'baz', function (err, result) {
      r.sismember('qux', 'bar', function (err, result) {
        result.should.eql(0);
        r.end();
        done();
      });
    });
  });

  it('should return error when the value stored at the key is not a set', function (done) {
    var r = redismock.createClient();
    r.hset('foo', 'bar', 'baz', function (err, result) {
      r.sismember('foo', 'bar', function (err, result) {
        err.message.should.eql('WRONGTYPE Operation against a key holding the wrong kind of value');
        r.end();
        done();
      });
    });
  });

});
