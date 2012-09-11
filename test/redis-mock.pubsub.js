var redismock = require("../"),
	should = require("should"),
	events = require("events");


describe("publish and subscribe", function () {

    it("should subscribe and unsubscribe to a channel", function (done) {

        var r = redismock.createClient("", "", "");

        should.exist(r.subscribe);
        should.exist(r.unsubscribe);

        var channelName = "testchannel";

        r.on("subscribe", function (ch) {

            should.equal(ch, channelName);
            r.unsubscribe("testchannel");
        });

        r.on("unsubscribe", function (ch) {

            should.equal(ch, channelName);
            done();
        });

        r.subscribe(channelName);
    });

    it("should publish to a channel and recieve when subscribing to that channel", function (done) {

        var channelName = "testchannel";

        var r = redismock.createClient("", "", "");

        r.subscribe(channelName);

        r.on('message', function (ch, msg) {

            ch.should.equal(channelName);
            r.unsubscribe(channelName);
            done();
        });

        r.publish(channelName, "");

    });

    it("should only recieve message on channels subscribed to", function (done) {

        var channelName = "testchannel";
        var otherChannel = "otherchannel";

        var r = redismock.createClient("", "", "");
        r.subscribe(channelName);

        r.on('message', function (ch, msg) {
            ch.should.equal(channelName);

            r.unsubscribe(channelName);

            done();
        });

        r.publish(otherChannel, "");
        process.nextTick(function () {
            r.publish(channelName, "");
        });
    });

    it("should support multiple subscribers", function (done) {

        var channelName = "testchannel";
        var doneChannel = "donechannel";

        var r = redismock.createClient("", "", "");
        var r2 = redismock.createClient("", "", "");

        r.subscribe(channelName);
        r2.subscribe(channelName);
        r2.subscribe(doneChannel);

        var channelNameCallsRecieved = 0;

        r.on('message', function (ch, msg) {

            ch.should.equal(channelName);
            channelNameCallsRecieved++;

        });

        r2.on('message', function (ch, msg) {

            if (ch == channelName) {
                channelNameCallsRecieved++;
            } else if (ch == doneChannel) {

                should.equal(channelNameCallsRecieved, 4);
                r.unsubscribe(channelName);
                r2.unsubscribe(channelName);
                r2.unsubscribe(doneChannel);

                done();
            }
        });

        r.publish(channelName, "");
        r.publish(channelName, "");
        r.publish(doneChannel, "");

    });

});