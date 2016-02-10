var DatabaseHelper = require('../helpers/DatabaseHelper');
var ErrorHelper = require('../helpers/ErrorHelper');

var UserService = require('./UserService');
var AuthService = require('./AuthService');

var async = require('async');
var restify = require('restify');

// exports

module.exports.getBeers = _getBeers;
module.exports.getBeer = _getBeer;
module.exports.rateBeer = _rateBeer;
module.exports.getRatings = _getRatings;

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

function _getBeer(beerId, callback) {
    DatabaseHelper
        .getCollection(DatabaseHelper.CollectionsNames.BEERS)
        .find({_id: beerId + ''})
        .limit(1)
        .next(function (err, result) {
            if (err) {
                return callback(ErrorHelper.handleError(err));
            }
            if (!result) {
                return callback(new restify.errors.ResourceNotFoundError('No beer with id \'%s\'', beerId));
            }
            if (result.ratings) {
                result.ratings = {
                    average: result.ratings
                        .reduce(function (memo, rating) {
                            return memo + rating.rate;
                        }, 0) / result.ratings.length,
                    last: result.ratings.slice(-3)
                };
            }
            callback(null, result);
        });
}

function _unrateBeer(userId, beerId, callback) {
    async.series([
        function (cb) {
            DatabaseHelper
                .getCollection(DatabaseHelper.CollectionsNames.USERS)
                .update(
                    {_id: userId},
                    {
                        $pull: {
                            'ratings': {
                                beerId: beerId + ''
                            }
                        }
                    },
                    function (err) {
                        if (err) {
                            return cb(ErrorHelper.handleError(err));
                        }
                        cb(err);
                    }
                );
        },
        function (cb) {
            DatabaseHelper
                .getCollection(DatabaseHelper.CollectionsNames.BEERS)
                .update(
                    {_id: beerId + ''},
                    {
                        $pull: {
                            'ratings': {
                                username: userId
                            }
                        }
                    },
                    function (err) {
                        if (err) {
                            return cb(ErrorHelper.handleError(err));
                        }
                        cb(err);
                    }
                );
        }
    ], function (err) {
        callback(err);
    });
}

function _rateBeer(userId, beerId, rate, callback) {
    var ratingDate = new Date();
    async.series([
        function (cb) {
            UserService.getUser(userId, cb);
        },
        function (cb) {
            _unrateBeer(userId, beerId, cb);
        },
        function (cb) {
            DatabaseHelper
                .getCollection(DatabaseHelper.CollectionsNames.BEERS)
                .update(
                    {_id: beerId + ''},
                    {
                        '$push': {
                            'ratings': {
                                username: userId,
                                date: ratingDate,
                                rate: rate
                            }
                        }
                    },
                    function (err, results) {
                        if (err) {
                            return callback(ErrorHelper.handleError(err));
                        }
                        if (!results.result.nModified) {
                            return cb(new restify.errors.ResourceNotFoundError('No beer with id \'%s\'', beerId));
                        }
                        cb();
                    }
                );
        },
        function (cb) {
            DatabaseHelper
                .getCollection(DatabaseHelper.CollectionsNames.USERS)
                .update(
                    {_id: userId},
                    {
                        '$push': {
                            'ratings': {
                                beerId: beerId + '',
                                date: ratingDate,
                                rate: rate
                            }
                        }
                    },
                    cb
                );
        }
    ], function (err) {
        callback(err);
    });
}

function _getRatings(beerId, callback) {
    DatabaseHelper
        .getCollection(DatabaseHelper.CollectionsNames.BEERS)
        .aggregate([
            {$match: {_id: beerId + ''}},
            {$project: {ratings: true}},
            {$unwind: '$ratings'},
            {$sort: {date: 1}},
            {$group: {
                _id: '$_id',
                ratings: {$push: '$ratings'}
            }}
        ])
        .limit(1)
        .next(function (err, result) {
            if (err) {
                return callback(ErrorHelper.handleError(err));
            }
            if (!result) {
                return callback(new restify.errors.ResourceNotFoundError('No beer with id \'%s\'', beerId));
            }
            callback(null, result.ratings || []);
        });
}