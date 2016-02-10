var BreweryService = require('../services/BreweryService');
var HTTPMethod = require('../constants/HTTPMethod');

// exports

module.exports.getBreweries = _getBreweries();
module.exports.getBeers = _getBeers();

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

function _getBeers() {
    return {
        method: HTTPMethod.GET,
        url: '/breweries/:id',
        action: function (req, callback) {
            BreweryService.getBeers(
                req.params.id,
                callback
            );
        }
    };
}