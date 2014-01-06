var redismock = require("../"),
    should = require("should");

if (process.env['VALID_TESTS']) {
    redismock = require('redis'); 
}

describe('server', function() {
    describe("flushdb", function (done) {
        var client = redismock.createClient();

        it("should clean database", function(done) {

            var callback = function(err, result) {
                client.flushdb(function (err, result) {
                    result.should.equal("OK");
                    
                    client.exists("foo", function(err, result) {

                        result.should.be.equal(0);

                        client.end();
                        done();
                    })


                });
            };

            client.set("foo", "bar", callback);
        });
    });

    describe('dbsize', function() {
        it('should return the size of the database', function(done) {
            var callback = function(err, result) {
                should.not.exist( err );
                should.exist( result );

                result.should.equal( 0 );

                done();
            };

            redismock.createClient().dbsize( callback );
        });
    });

    describe('save/lastsave', function() {
        it('should save the database and store the last saved time');
        it('should report the last time the data was save');
    });

    describe('time', function() {
        it('should return the time object', function(done) {
            var callback = function(err, result) {
                should.not.exist( err );
                should.exist( result );

                result.length.should.equal( 2 );
                console.log( result );

                var now = Math.round( Date.now() / 1000 ),
                    seconds = result[0],
                    micros = result[1];

                seconds.should.be.within( now - 5, now + 1 );
                micros.should.be.within( 0, 999999 );

                done();
            };

            redismock.createClient().time( callback );
        });
    });

    describe('ping', function() {
        it('should return a pong', function(done) {
            var callback = function(err, response) {
                should.not.exist( err );
                should.exist( response );

                response.should.equal( 'PONG' );

                done();
            };

            redismock.createClient().ping( callback );
        });
    })
});
