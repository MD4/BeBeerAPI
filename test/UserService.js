var expect = require('chai').expect;
var async = require('async');

var UserService = require('../services/UserService');
var DatabaseHelper = require('../helpers/DatabaseHelper');

describe('User service', function () {
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

    describe('Creates an user', function () {
        var user;
        before(function (done) {
            UserService.createUser({
                email: 'lol@lolilol.fr',
                username: 'Lol42',
                password: 'password'
            }, function (err, result) {
                expect(err).to.not.exist;
                user = result;
                done();
            });
        });
        it('Returns the created user', function () {
            expect(user).to.exist;
            expect(user._id).to.equal('Lol42');
            expect(user.email).to.equal('lol@lolilol.fr');
            expect(user.password).to.exists;
        });
    });

    describe('Duplicate user', function () {
        var error;
        before(function (done) {
            UserService.createUser({
                email: 'lol@lolilol.fr',
                username: 'Lol42',
                password: 'password'
            }, function (err) {
                error = err;
                done();
            });
        });
        it('throws a duplicate error', function () {
            expect(error).to.exist;
        });
    });

    describe('Gets an user', function () {
        var user;
        before(function (done) {
            UserService.getUser(
                'Lol42',
                function (err, result) {
                    expect(err).to.not.exist;
                    user = result;
                    done();
                }
            );
        });
        it('Returns an existing user', function () {
            expect(user).to.exist;
            expect(user._id).to.equal('Lol42');
            expect(user.email).to.equal('lol@lolilol.fr');
        });
    });

    describe('Error on getting unexisting user', function () {
        var error;
        before(function (done) {
            UserService.getUser(
                'unexisting',
                function (err) {
                    error = err;
                    done();
                }
            );
        });
        it('throws a not found error', function () {
            expect(error).to.exist;
        });
    });

});