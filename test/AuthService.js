var expect = require('chai').expect;
var async = require('async');

var UserService = require('../services/UserService');
var AuthService = require('../services/AuthService');
var DatabaseHelper = require('../helpers/DatabaseHelper');

describe('User service', function () {
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

    describe('Authentication success', function () {
        var user;
        before(function (done) {
            AuthService.check(
                'Lol42',
                'password',
                function (err, result) {
                    expect(err).to.not.exist;
                    user = result;
                    done();
                });
        });
        it('Returns the auhtenticated user', function () {
            expect(user).to.exist;
            expect(user._id).to.equal('Lol42');
            expect(user.email).to.equal('lol@lolilol.fr');
            expect(user.password).to.exists;
        });
    });

    describe('Authentication fail', function () {
        var error;
        before(function (done) {
            AuthService.check(
                'Lol42',
                'passwordd',
                function (err, result) {
                    expect(err).to.exist;
                    expect(result).to.not.exist;
                    error = err;
                    done();
                });
        });
        it('Trhows an unauthorized error', function () {
            expect(error.statusCode).to.equal(401);
        });
    });

});