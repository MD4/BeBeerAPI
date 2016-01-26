var HTTPMethod = require('../constants/HTTPMethod');

// exports

module.exports.getBreweries = _getBreweries();
module.exports.getBrewery = _getBrewery();

// private

function _getBreweries() {
    return {
        method: HTTPMethod.GET,
        url: '/breweries',
        action: function (req, callback) {
            callback(null, []);
        }
    };
}

function _getBrewery() {
    return {
        method: HTTPMethod.GET,
        url: '/breweries/:id',
        action: function (req, callback) {
            callback(null, {});
        }
    };
}