var redismock = require("../"),
  should = require("should");

if (process.env['VALID_TESTS']) {
  redismock = require('redis');
}

describe("flushdb", function () {

  it("should clean database", function (done) {

    var r = redismock.createClient();

    r.set("foo", "bar", function (err, result) {
      r.flushdb(function (err, result) {
        result.should.equal("OK");

        r.exists("foo", function (err, result) {

          result.should.be.equal(0);

          r.end();
          done();
        })


      });

    });

  });

});

describe("scan", function () {

  it("should return cursor and keys", function (done) {

    var r = redismock.createClient();

    r.set("foo", "bar", function (err, result) {

      r.scan([0], function (err, result) {

        should(result instanceof Array).be.exactly(true);
        should(result.length).be.exactly(2);
        should(isNaN(result[0])).be.exactly(false);
        should(result[1] instanceof Array).be.exactly(true);
        should(result[1].length).be.exactly(1);

        r.end();
        done();

      });

    });

  });

  it("should work with patterns", function (done) {

    var r = redismock.createClient();

    r.set("foo", "a", function (err, result) {

      r.set("family", "b", function (err, result) {

        r.set("burger", "food", function (err, result) {

          r.scan([0, 'MATCH', 'f*'], function (err, result) {

            should(result instanceof Array).be.exactly(true);
            should(result.length).be.exactly(2);
            should(isNaN(result[0])).be.exactly(false);
            should(result[1] instanceof Array).be.exactly(true);
            should(result[1].length).be.exactly(2);

            r.end();
            done();

          });

        });

      });

    });

  });

  it("should work with count", function (done) {

    var r = redismock.createClient();

    r.set("foo", "a", function (err, result) {

      r.set("family", "b", function (err, result) {

        r.set("burger", "food", function (err, result) {

          r.scan([0, 'COUNT', 1], function (err, result) {

            should(result instanceof Array).be.exactly(true);
            should(result.length).be.exactly(2);
            should(isNaN(result[0])).be.exactly(false);
            should(result[1] instanceof Array).be.exactly(true);
            should(result[1].length).be.exactly(1);

            r.end();
            done();

          });

        });

      });

    });

  });

  it("should work with count, cursor, and patterns", function (done) {

    var r = redismock.createClient();

    r.set("foo", "a", function (err, result) {

      r.set("family", "b", function (err, result) {

        r.set("burger", "food", function (err, result) {

          r.scan([1, 'COUNT', 1, 'MATCH', 'f*'], function (err, result) {

            should(result instanceof Array).be.exactly(true);
            should(result.length).be.exactly(2);
            should(isNaN(result[0])).be.exactly(false);
            should(result[1] instanceof Array).be.exactly(true);
            should(result[1].length).be.exactly(1);
            should(result[1][0]).be.exactly('family');

            r.end();
            done();

          });

        });

      });

    });

  });

});
