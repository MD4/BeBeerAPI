var DatabaseHelper = require('../helpers/DatabaseHelper');
var restify = require('restify');

// exports

module.exports.getBeers = _getBeers;
module.exports.getBeer = _getBeer;

// private

function _getBeers(options, callback) {
    options.searchByName = options.searchByName || '';
    options.count = options.count || 20;
    options.offset = options.offset || 0;

    var query = {};

    if (options.searchByName) {
        query.name = {
            '$regex': new RegExp(options.searchByName, 'gi')
        };
    }

    DatabaseHelper
        .getCollection(DatabaseHelper.CollectionsNames.BEERS)
        .find(
            query,
            {
                _id: true,
                name: true,
                country: true,
                brewery: true
            }
        )
        .sort({name: 1})
        .skip(options.offset)
        .limit(options.count)
        .toArray(callback);
}

function _getBeer(id, callback) {
    DatabaseHelper
        .getCollection(DatabaseHelper.CollectionsNames.BEERS)
        .find({_id: +id})
        .limit(1)
        .next(function(err, result) {
            if (err) {
                return callback(ErrorHelper.handleError(err));
            }
            if (!result) {
                return callback(new restify.errors.ResourceNotFoundError('No beer with id \'%s\'', id));
            }
            callback(null, result);
        });
}