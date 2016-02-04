var DatabaseHelper = require('../helpers/DatabaseHelper');
var ErrorHelper = require('../helpers/ErrorHelper');
var SecurityHelper = require('../helpers/SecurityHelper');

var UserService = require('./UserService');

var restify = require('restify');

// exports

module.exports.check = _check;

// private

function _check(username, password, callback) {
    DatabaseHelper
        .getCollection(DatabaseHelper.CollectionsNames.USERS)
        .find({
            _id: username,
            password: SecurityHelper.sha1(password)
        }, {
            password: false
        })
        .map(UserService.getGravatarizedUser)
        .limit(1)
        .next(function (err, result) {
            if (err) {
                return callback(ErrorHelper.handleError(err));
            }
            if (!result) {
                return callback(new restify.errors.UnauthorizedError('No user with username \'%s\' or bad password.', username));
            }
            callback(null, result);
        });
}