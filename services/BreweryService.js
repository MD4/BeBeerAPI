var DatabaseHelper = require('../helpers/DatabaseHelper');
var restify = require('restify');

// exports

module.exports.getBreweries = _getBreweries;
module.exports.getBeers = _getBeers;

// private

function _getBreweries(options, callback) {
    options.searchByName = options.searchByName || '';
    options.count = options.count || 20;
    options.offset = options.offset || 0;

    var query = {};

    if (options.searchByName) {
        query.brewery = {
            '$regex': new RegExp(options.searchByName, 'gi')
        };
    }

    DatabaseHelper
        .getCollection(DatabaseHelper.CollectionsNames.BEERS)
        .aggregate([
            {'$match': query},
            {'$sort': {name: 1}},
            {'$group': {_id: '$brewery', country: {'$first': '$country'}}},
            {'$skip': options.offset},
            {'$limit': options.count}
        ])
        .toArray(callback);
}

function _getBeers(breweryId, callback) {
    console.log(breweryId);
    DatabaseHelper
        .getCollection(DatabaseHelper.CollectionsNames.BEERS)
        .find(
            {brewery: breweryId},
            {
                _id: true,
                name: true,
                country: true,
                brewery: true
            }
        )
        .sort({name: 1})
        .toArray(callback);
}