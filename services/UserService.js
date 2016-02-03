var DatabaseHelper = require('../helpers/DatabaseHelper');
var ErrorHelper = require('../helpers/ErrorHelper');
var SecurityHelper = require('../helpers/SecurityHelper');

var restify = require('restify');

// exports

module.exports.createUser = _createUser;
module.exports.getUser = _getUser;

// private

function _createUser(data, callback) {
    DatabaseHelper
        .getCollection(DatabaseHelper.CollectionsNames.USERS)
        .insert(
            {
                email: data.email,
                _id: data.username,
                password: SecurityHelper.hash(data.password)
            },
            {},
            function (err, records) {
                if (err) {
                    return callback(ErrorHelper.handleError(err));
                }
                var user = records.ops[0];
                delete user.password;
                callback(err, user);
            }
        );
}

function _getUser(id, callback) {
    DatabaseHelper
        .getCollection(DatabaseHelper.CollectionsNames.USERS)
        .find(
            {_id: id},
            {password: false}
        )
        .limit(1)
        .next(function (err, result) {
            if (err) {
                return callback(ErrorHelper.handleError(err));
            }
            if (!result) {
                return callback(new restify.errors.ResourceNotFoundError('No user with id \'%s\'', id));
            }
            callback(null, result);
        });
}