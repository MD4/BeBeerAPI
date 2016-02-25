var DatabaseHelper = require('../helpers/DatabaseHelper');
var ErrorHelper = require('../helpers/ErrorHelper');
var restify = require('restify');

// exports

module.exports.getBreweries = _getBreweries;
module.exports.getBrewery = _getBrewery;
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

function _getBrewery(breweryName, callback) {
    DatabaseHelper
        .getCollection(DatabaseHelper.CollectionsNames.BEERS)
        .aggregate([
            {$match: {brewery: breweryName}},
            {$sort: {name: 1}},
            {$limit: 3},
            {
                $group: {
                    _id: '$brewery',
                    country: {$first: '$country'},
                    beers: {
                        $push: {
                            id: '$_id',
                            name: '$name'
                        }
                    }
                }
            },
            {$project: {
                '_id': false,
                'name': '$_id',
                'country': '$country',
                'beers': '$beers'
            }}
        ])
        .limit(1)
        .next(function (err, result) {
            if (err) {
                return callback(ErrorHelper.handleError(err));
            }
            if (!result) {
                return callback(new restify.errors.ResourceNotFoundError('No brewery named \'%s\'', breweryName));
            }
            callback(null, result);
        });
}

function _getBeers(breweryId, callback) {
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