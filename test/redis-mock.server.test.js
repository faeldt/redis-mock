var redismock = require("../"),
    should = require("should");

if (process.env['VALID_TESTS']) {
    redismock = require('redis'); 
}

describe('server', function() {


    describe("flushdb", function () {

        it("should clean database", function(done) {

            var r = redismock.createClient();

            r.set("foo", "bar", function (err, result) {
                r.flushdb(function (err, result) {
                    result.should.equal("OK");
                    
                    r.exists("foo", function(err, result) {

                        result.should.be.equal(0);

                        r.end();
                        done();
                    })


                });

            });

        });

    });

    describe('ping', function() {
        it('should return a pong', function(done) {
            var r = redismock.createClient();

            var callback = function(err, response) {
                should.not.exist( err );
                should.exist( response );

                response.should.equal( 'PONG' );

                done();
            };

            r.ping( callback );
        });
    })
});
