var async = require('async');
var restify = require('restify');

var AuthService = require('../services/AuthService');
var HTTPMethod = require('../constants/HTTPMethod');

// exports

module.exports.auth = _auth();
module.exports.getAuth = _getAuth();
module.exports.deleteAuth = _deleteAuth();

// private

function _auth() {
    return {
        method: HTTPMethod.POST,
        url: '/auth',
        action: function (req, callback) {
            var session = req.session;
            AuthService.check(
                req.body.username,
                req.body.password,
                function (err, user) {
                    session.user = user;
                    if (err) {
                        return callback(err);
                    }
                    return callback(err, user);
                }
            );
        }
    };
}

function _getAuth() {
    return {
        method: HTTPMethod.GET,
        url: '/auth',
        action: function (req, callback) {
            if (!req.session.user) {
                return callback(new restify.errors.UnauthorizedError());
            }
            callback(null, req.session.user);
        }
    };
}

function _deleteAuth() {
    return {
        method: HTTPMethod.DELETE,
        url: '/auth',
        action: function (req, callback) {
            if (!req.session.user) {
                return callback(new restify.errors.UnauthorizedError());
            }
            delete req.session.user;
            callback();
        }
    };
}