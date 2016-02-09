var restify = require('restify');

var AuthService = require('../services/AuthService');
var UserService = require('../services/UserService');

var HTTPMethod = require('../constants/HTTPMethod');

var ErrorHelper = require('../helpers/ErrorHelper');

// exports

module.exports.auth = _auth();
module.exports.getAuth = _getAuth();
module.exports.deleteAuth = _deleteAuth();

module.exports.getAuthUser = _getAuthUser;
module.exports.updateAuthUser = _updateAuthUser;

// private

function _auth() {
    return {
        description: 'Authenticates the user with the given credentials.',
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
        description: 'Returns the current authentication.',
        method: HTTPMethod.GET,
        url: '/auth',
        action: function (req, callback) {
            if (!_getAuthUser(req)) {
                return callback(new restify.errors.UnauthorizedError());
            }
            callback(null, req.session.user);
        }
    };
}

function _deleteAuth() {
    return {
        description: 'Deauthenticates the user.',
        method: HTTPMethod.DELETE,
        url: '/auth',
        action: function (req, callback) {
            if (!_getAuthUser(req)) {
                return callback(new restify.errors.UnauthorizedError());
            }
            delete req.session.user;
            callback();
        }
    };
}


function _getAuthUser(req) {
    return ((req && req.session) ? req.session.user : null);
}

function _updateAuthUser(req, callback) {
    UserService
        .getUser(
            _getAuthUser(req)._id,
            function (err, user) {
                if (err) {
                    return callback(ErrorHelper.handleError(err));
                }
                if (!user) {
                    return callback(ErrorHelper.ResourceNotFoundError());
                }
                req.session.user = user;
                callback(null, user);
            }
        );
}