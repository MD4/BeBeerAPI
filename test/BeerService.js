var expect = require('chai').expect;
var async = require('async');

var BeerService = require('../services/BeerService');
var UserService = require('../services/UserService');
var DatabaseHelper = require('../helpers/DatabaseHelper');

describe('Beer service', function () {
    this.timeout(15000);

    before(function (done) {
        async.series([
            DatabaseHelper.enableTestMode,
            DatabaseHelper.connect,
            DatabaseHelper.initialize
        ], function (err) {
            if (err) {
                console.error(err);
            }
            expect(err).to.not.exist;
            done();
        });
    });
    before(function (done) {
        UserService.createUser({
            email: 'lol@lolilol.fr',
            username: 'Lol42',
            password: 'password'
        }, function (err, result) {
            expect(err).to.not.exist;
            expect(result).to.exist;
            done();
        });
    });

    describe('Get beer list', function () {
        var beers;
        before(function (done) {
            BeerService.getBeers({}, function (err, results) {
                beers = results;
                done();
            });
        });
        it('retrieves a 20-length beer list', function () {
            expect(beers.length).equals(20);
        });
    });

    describe('Get beer list limited', function () {
        var beers;
        before(function (done) {
            BeerService.getBeers({
                count: 10
            }, function (err, results) {
                beers = results;
                done();
            });
        });
        it('retrieves a 10-length beer list', function () {
            expect(beers.length).equals(10);
        });
    });

    describe('Search beers by name', function () {
        var beers;
        before(function (done) {
            BeerService.getBeers({
                searchByName: 'bon'
            }, function (err, results) {
                beers = results;
                done();
            });
        });
        it('retrieves a 7(or more)-length  beer list', function () {
            expect(beers.length).least(7);
        });
    });

    describe('Search beer by id', function () {
        var beer;
        before(function (done) {
            BeerService.getBeer(
                100,
                function (err, result) {
                    beer = result;
                    done();
                });
        });
        it('retrieves the beer with id 100', function () {
            expect(beer).to.exist;
        });
    });

    describe('Search beer by id', function () {
        var beer;
        before(function (done) {
            BeerService.getBeer(
                100000,
                function (err, result) {
                    beer = result;
                    done();
                });
        });
        it('retrieves nothing', function () {
            expect(beer).to.not.exist;
        });
    });


    describe('Rate a beer', function () {
        var beer;
        var user;
        before(function (done) {
            async.series([
                function (cb) {
                    BeerService.rateBeer(
                        'Lol42',
                        42,
                        3,
                        cb
                    );
                },
                function (cb) {
                    BeerService.getBeer(
                        42,
                        function(err, result) {
                            beer = result;
                            cb(err);
                        }
                    );
                },
                function (cb) {
                    UserService.getUser(
                        'Lol42',
                        function(err, result) {
                            user = result;
                            cb(err);
                        }
                    );
                }
            ], function (err) {
                expect(err).to.not.exist;
                done();
            });

        });
        it('rate the beer', function () {
            expect(beer).to.exist;
            expect(beer.ratings.average).to.equal(3);
            expect(beer.ratings.last).to.exist;
            expect(beer.ratings.last).to.have.length.of(1);
            expect(beer.ratings.last[0].rate).to.equal(3);
            expect(beer.ratings.last[0].username).to.equal('Lol42');
            expect(+beer.ratings.last[0].date).to.be.below(+new Date());

            expect(user).to.exist;
            expect(user.ratings).to.exist;
            expect(user.ratings).to.have.length.of(1);
            expect(user.ratings[0].rate).to.equal(3);
            expect(user.ratings[0].beerId).to.equal(42);
            expect(+user.ratings[0].date).to.be.below(+new Date());
        });
    });


    describe('Re-rate a beer', function () {
        var beer;
        var user;
        before(function (done) {
            async.series([
                function (cb) {
                    BeerService.rateBeer(
                        'Lol42',
                        42,
                        2,
                        cb
                    );
                },
                function (cb) {
                    BeerService.getBeer(
                        42,
                        function(err, result) {
                            beer = result;
                            cb(err);
                        }
                    );
                },
                function (cb) {
                    UserService.getUser(
                        'Lol42',
                        function(err, result) {
                            user = result;
                            cb(err);
                        }
                    );
                }
            ], function (err) {
                expect(err).to.not.exist;
                done();
            });

        });
        it('rate the beer', function () {
            expect(beer).to.exist;
            expect(beer.ratings.average).to.equal(2);
            expect(beer.ratings.last).to.exist;
            expect(beer.ratings.last).to.have.length.of(1);
            expect(beer.ratings.last[0].rate).to.equal(2);
            expect(beer.ratings.last[0].username).to.equal('Lol42');
            expect(+beer.ratings.last[0].date).to.be.below(+new Date());

            expect(user).to.exist;
            expect(user.ratings).to.exist;
            console.log(user);
            expect(user.ratings).to.have.length.of(1);
            expect(user.ratings[0].rate).to.equal(2);
            expect(user.ratings[0].beerId).to.equal(42);
            expect(+user.ratings[0].date).to.be.below(+new Date());
        });
    });


    describe('Rate an unexisting beer', function () {
        var error;
        before(function (done) {
            BeerService.rateBeer(
                'Lol42',
                999999999,
                2,
                function(err) {
                    error = err;
                    done();
                }
            );
        });
        it('throws an error', function () {
            expect(error).to.exist;
        });
    });


    describe('Rate with an unexisting user', function () {
        var error;
        before(function (done) {
            BeerService.rateBeer(
                'bullshitman',
                42,
                2,
                function(err) {
                    error = err;
                    done();
                }
            );
        });
        it('throws an error', function () {
            expect(error).to.exist;
        });
    });

});