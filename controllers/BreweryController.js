var BreweryService = require('../services/BreweryService');
var HTTPMethod = require('../constants/HTTPMethod');

// exports

module.exports.getBreweries = _getBreweries();

// private

function _getBreweries() {
    return {
        method: HTTPMethod.GET,
        url: '/breweries',
        action: function (req, callback) {
            BreweryService.getBreweries(
                {
                    offset: +req.params.offset,
                    count: +req.params.count,
                    searchByName: req.params.name
                },
                callback
            );
        }
    };
}