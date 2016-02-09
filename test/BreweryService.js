var expect = require('chai').expect;
var async = require('async');

var BreweryService = require('../services/BreweryService');
var DatabaseHelper = require('../helpers/DatabaseHelper');

describe('Brewery service', function () {
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

    describe('Get brewery list', function () {
        var breweries;
        before(function (done) {
            BreweryService.getBreweries({}, function (err, results) {
                breweries = results;
                done();
            });
        });
        it('retrieves a 20-length brewery list', function () {
            expect(breweries.length).equals(20);
        });
    });

    describe('Get brewery list limited', function () {
        var breweries;
        before(function (done) {
            BreweryService.getBreweries({
                count: 10
            }, function (err, results) {
                breweries = results;
                done();
            });
        });
        it('retrieves a 10-length brewery list', function () {
            expect(breweries.length).equals(10);
        });
    });

    describe('Search breweries by name', function () {
        var breweries;
        before(function (done) {
            BreweryService.getBreweries({
                searchByName: 'kro'
            }, function (err, results) {
                breweries = results;
                done();
            });
        });
        it('retrieves a 7(or more)-length  brewery list', function () {
            expect(breweries.length).least(2);
        });
    });

    describe('Get brewery beers', function () {
        var beers;
        before(function (done) {
            BreweryService.getBeers(
                'br. Huyghe',
                function (err, results) {
                    console.log(1, results);
                    beers = results;
                    done();
                });
        });
        it('retrieves a 2(or more)-length  beer list', function () {
            expect(beers.length).least(2);
        });
    });
});