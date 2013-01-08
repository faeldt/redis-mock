var redismock = require("../"),
	should = require("should"),
	events = require("events");

describe("redis-mock", function () {

    it("should create an instance of RedisClient which inherits from EventEmitter", function () {

        should.exist(redismock.createClient);

        var r = redismock.createClient("", "", "");
        should.exist(r);
        r.should.be.an.instanceof(redismock.RedisClient);
        r.should.be.an.instanceof(events.EventEmitter);

        r.end();

    });

    it("should emit ready and connected when creating client", function (done) {

        var r = redismock.createClient("", "", "");

        var didEmitReady = false;

        r.on("ready", function () {

            didEmitReady = true;                        

        });

        r.on("connect", function () {

            didEmitReady.should.equal(true);

            r.end();

            done();

        });

    });

    it("should have function end() that emits event 'end'", function (done) {

        var r = redismock.createClient("", "", "");

        r.on("end", function () {

            done();

        });

        r.end();

    });

});
