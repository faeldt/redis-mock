var redismock = require('../')
  , should = require('should');

if (process.env['VALID_TESTS']) {
  redismock = require('redis');
}

describe('zadd', function() {

  it('should add a member to the sorted set', function(done) {
    var r = redismock.createClient('', '', '');
    r.zadd('ztmp', 1, 'bar', function(err, result) {
      should.not.exist(err);
      should.exist(result);
      result.should.eql(1);

      r.zrange('ztmp', 0, -1, function(err, results) {
        should.not.exist(err);
        should.exist(results);
        results.should.eql(['bar']);

        r.end();
        done();
      });
    });
  });

  it('should add members to the set', function(done) {
    var r = redismock.createClient('', '', '');
    r.zadd('ztmp', 10, 'x', 20, 'y', 30, 'z', function(err, result) {
      should.not.exist(err);
      should.exist(result);
      result.should.eql(3);

      r.zrange('ztmp', 0, -1, function(err, results) {
        should.not.exist(err);
        should.exist(results);
        results.should.have.length(3);
        results.should.eql(['x', 'y', 'z']);

        r.end();
        done();
      });
    });
  });

  it('should update members that are already a member of the set', function(done) {
    var r = redismock.createClient('', '', '');
    r.zadd('foo', 10, 'bar', 20, 'bar', 30, 'baz', function(err, result) {
      should.not.exist(err);
      should.exist(result);
      result.should.eql(2);

      r.zadd('foo', 20, 'baz', function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.should.eql(0);

        r.zrange('foo', 0, -1, function(err, result) {
          should.not.exist(err);
          should.exist(result);
          result.should.include('bar')
          result.should.include('baz');
          result.should.have.length(2);

          r.end();
          done();
        });
      });
    });
  });

  it('should return error when the value stored at the key is not a sorted set', function(done) {
    var r = redismock.createClient('', '', '');

    r.hset('foo', 'bar', 'baz', function (err, result) {

      r.zadd('foo', 3, 'bar', function(err, result) {
        should.exist(err);
        should.not.exist(result);
        err.message.should.eql('ERR Operation against a key holding the wrong kind of value');

        r.end();
        done();
      });
    });
  });

  it('should support arguments without callback', function(done) {
    var r = redismock.createClient('', '', '');
    r.zadd('foo', 10, 'bar', 20, 'baz');
    r.zrange('foo', 0, -1, function(err, result) {
      should.not.exist(err);
      should.exist(result);
      result.should.include('bar');
      result.should.include('baz');
      result.should.have.length(2);

      r.end();
      done();
    });
  });

});

describe('zrem', function() {

  it('should remove a member from the sorted set', function(done) {
    var r = redismock.createClient('', '', '');
    r.zadd('foo', 10, 'bar', 20, 'baz', 30, 'qux', function(err, result) {

      r.zrem('foo', 'bar', function(err, result) {
        result.should.eql(1);

        r.zrange('foo', 0, -1, function(err, result) {
          result.should.include('baz');
          result.should.include('qux');
          result.should.have.length(2);

          r.end();
          done();
        });
      });
    });
  });

  it('should remove members from the sorted set', function(done) {
    var r = redismock.createClient('', '', '');
    r.zadd('foo', 10, 'bar', 20, 'baz', 30, 'qux', function(err, result) {

      r.zrem('foo', 'bar', 'baz', function(err, result) {
        result.should.eql(2);

        r.zrange('foo', 0, -1, function(err, result) {
          result.should.not.include('bar');
          result.should.not.include('baz');
          result.should.include('qux');
          result.should.have.length(1);

          r.end();
          done();
        });
      });
    });
  });

  it('should ignore members that are not a member of the set', function(done) {
    var r = redismock.createClient('', '', '');
    r.zadd('foo', 10, 'bar', function(err, result) {

      r.zrem('foo', 'bar', 'baz', function(err, result) {
        result.should.eql(1);

        r.zrange('foo', 0, -1, function(err, result) {
          result.should.eql([]);

          r.end();
          done();
        });
      });
    });
  });

  it('should return 0 if the key does not exist', function(done) {
    var r = redismock.createClient('', '', '');
    r.zadd('foo', 10, 'bar', function(err, result) {

      r.zrem('baz', 'qux', function(err, result) {
        result.should.eql(0);

        r.end();
        done();
      });
    });
  });

  it('should return error when the value stored at the key is not a set', function(done) {
    var r = redismock.createClient('', '', '');

    r.hset('foo', 'bar', 'baz', function (err, result) {

      r.zrem('foo', 'bar', function(err, result) {
        err.message.should.eql('ERR Operation against a key holding the wrong kind of value');

        r.end();
        done();
      });
    });
  });

  it('should support arguments without callback', function(done) {
    var r = redismock.createClient('', '', '');
    r.zadd('foo', 10, 'bar', 20, 'baz', function(err, result) {
      r.zrem('foo', 'bar', 'baz');
      r.zrange('foo', 0, -1, function(err, result) {
        result.should.not.include('bar');
        result.should.not.include('baz');
        result.should.have.length(0);

        r.end();
        done();
      });
    });
  });

});

// TODO: Add tests of ZRANGE

describe('zcard', function() {

  it('should return the number of elements', function(done) {
    var r = redismock.createClient('', '', '');
    r.zadd('foo', 10, 'bar', 20, 'baz', function(err, result) {
      r.zcard('foo', function(err, result) {
        result.should.eql(2);
        r.end();
        done();
      });
    });
  });

  it('should return 0 if key does not exist', function(done) {
    var r = redismock.createClient('', '', '');
    r.zadd('foo', 10, 'bar', 20, 'baz', function(err, result) {
      r.zcard('qux', function(err, result) {
        result.should.eql(0);
        r.end();
        done();
      });
    });
  });

  it('should return error when the value stored at the key is not a set', function(done) {
    var r = redismock.createClient('', '', '');
    r.hset('foo', 'bar', 'baz', function(err, result) {
      r.zcard('foo', function(err, result) {
        err.message.should.eql('ERR Operation against a key holding the wrong kind of value');
        r.end();
        done();
      });
    });
  });

});
