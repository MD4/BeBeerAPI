var UserService = require('../services/UserService');
var HTTPMethod = require('../constants/HTTPMethod');

// exports

module.exports.createUser = _createUser();
module.exports.getUser = _getUser();

// private

function _createUser() {
    return {
        method: HTTPMethod.POST,
        url: '/users',
        action: function (req, callback) {
            UserService.createUser(
                {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                },
                callback
            );
        }
    };
}

function _getUser() {
    return {
        method: HTTPMethod.GET,
        url: '/users/:id',
        action: function (req, callback) {
            UserService.getUser(
                req.params.id,
                callback
            );
        }
    };
}