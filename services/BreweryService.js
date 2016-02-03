var DatabaseHelper = require('../helpers/DatabaseHelper');
var restify = require('restify');

// exports

module.exports.getBreweries = _getBreweries;

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