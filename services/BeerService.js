var DatabaseHelper = require('../helpers/DatabaseHelper');
var restify = require('restify');

// exports

module.exports.getBeers = getBeers;
module.exports.getBeer = getBeer;

// private

function getBeers(options, callback) {
    options.searchByName = options.searchByName || '';
    options.count = options.count || 20;
    options.offset = options.offset || 0;

    if (options.count < 1 || options.count > 30) {
        return callback(new restify.errors.InvalidArgumentError({
            message: 'Count must be in range [1-30].'
        }));
    }
    if (options.offset < 0) {
        return callback(new restify.errors.InvalidArgumentError({
            message: 'Offset must be positive.'
        }));
    }
    if (options.searchByName.length > 50) {
        return callback(new restify.errors.InvalidArgumentError({
            message: 'Search length must be less than 50 caracters.'
        }));
    }

    var query = {};

    if (options.searchByName) {
        query['$text'] = {
            '$search': options.searchByName
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

function getBeer(id, callback) {
    DatabaseHelper
        .getCollection(DatabaseHelper.CollectionsNames.BEERS)
        .find({_id: +id})
        .limit(1)
        .next(function(err, result) {
            if (err) {
                return callback(new restify.errors.InternalServerError());
            }
            if (!result) {
                return callback(new restify.errors.ResourceNotFoundError('No beer with id ' + id));
            }
            callback(null, result);
        });
}