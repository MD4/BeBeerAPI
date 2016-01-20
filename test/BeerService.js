var expect = require('chai').expect;
var BeerService = require('../services/BeerService');
var DatabaseHelper = require('../helpers/DatabaseHelper');
var async = require('async');

describe('Beer service', function () {
    before(function (done) {
        async.series([
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
});