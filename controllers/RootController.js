var config = require('../config/config');
var HTTPMethod = require('../constants/HTTPMethod');

// exports

module.exports.get = _get();

// private

function _get() {
    return {
        method: HTTPMethod.GET,
        url: '/',
        action: function (req, callback) {
            callback(null, config.api.info);
        }
    };
}