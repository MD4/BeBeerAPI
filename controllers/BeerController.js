var BeerService = require('../services/BeerService');
var AuthController = require('./AuthController');
var HTTPMethod = require('../constants/HTTPMethod');

var async = require('async');

// exports

module.exports.getBeers = _getBeers();
module.exports.getBeer = _getBeer();
module.exports.rateBeer = _rateBeer();

// private

function _getBeers() {
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

function _rateBeer() {
    return {
        method: HTTPMethod.POST,
        url: '/beers/:id/ratings',
        action: function (req, callback) {
            async.series([
                function(cb) {
                    BeerService.rateBeer(
                        AuthController.getAuthUser(req)._id,
                        req.params.id,
                        req.body.rating,
                        cb
                    )
                },
                function(cb) {
                    AuthController.updateAuthUser(req, cb);
                }
            ], function(err) {
                callback(err);
            });
        }
    };
}