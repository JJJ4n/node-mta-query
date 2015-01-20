var query = require('./mta-query');
var should = require('should');

describe('query', function () {
    it('should return info', function (done) {
        var options = {
            host: '37.59.21.32',
            port: 22003
        };

        query(options, function (error, response) {
            (error === null).should.be.true;

            response.should.be.type('object');

            response.should.have.property('address');
            response.address.should.be.a.String;
            response.address.should.equal(options.host);

            response.should.have.property('port');
            response.port.should.be.a.Number;

            response.should.have.property('address');
            response.address.should.be.a.String;

            response.should.have.property('gamename');
            response.gamename.should.be.a.String;

            response.should.have.property('hostname');
            response.hostname.should.be.a.String;

            response.should.have.property('gamemode');
            response.gamemode.should.be.a.String;

            response.should.have.property('mapname');
            response.mapname.should.be.a.String;

            response.should.have.property('version');
            response.version.should.be.a.String;

            response.should.have.property('passworded');
            response.passworded.should.be.a.Boolean;

            response.should.have.property('maxplayers');
            response.maxplayers.should.be.a.Number;

            response.should.have.property('online');
            response.online.should.be.a.Number;

            response.players.should.be.instanceof(Array).and.have.lengthOf(response.online);
            response.players.should.matchEach(function (it) {
                it.name.should.be.a.String;
                it.team.should.be.a.String;
                it.skin.should.be.a.String;
                it.score.should.be.a.Number;
                it.ping.should.be.a.Number;
                it.time.should.be.a.Number;
            });

            done();
        });
    });
});