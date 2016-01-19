var BeerService = require('../services/BeerService');
var HTTPMethod = require('../constants/HTTPMethod');

// exports

module.exports.getBeers = getBeers();
module.exports.getBeer = getBeer();

// private

function getBeers() {
    return {
        method: HTTPMethod.GET,
        url: '/beers',
        action: function (req, callback) {
            BeerService.getBeers(
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

function getBeer() {
    return {
        method: HTTPMethod.GET,
        url: '/beers/:id',
        action: function (req, callback) {
            BeerService.getBeer(
                req.params.id,
                callback
            );
        }
    };
}