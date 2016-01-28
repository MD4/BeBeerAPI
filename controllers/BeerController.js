var BeerService = require('../services/BeerService');
var HTTPMethod = require('../constants/HTTPMethod');

// exports

module.exports.getBeers = _getBeers();
module.exports.getBeer = _getBeer();

// private

function _getBeers() {
    return {
        method: HTTPMethod.GET,
        url: '/beers',
        action: function (req, callback) {
            var session = req.session;
            session.lol = Math.round(Math.random() * 100);
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

function _getBeer() {
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