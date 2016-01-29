var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var Error = require('../errors/Error');
var config = require('../config/config');
var merge = require('../data/merge');
var db;

var CollectionsNames = {
    BEERS: 'beers'
};

// exports

module.exports.CollectionsNames = CollectionsNames;

module.exports.getDB = _getDB;
module.exports.getCollection = _getCollection;
module.exports.connect = _connect;
module.exports.initialize = _initialize;
module.exports.finalize = _finalize;

// private

function _getDB() {
    return db;
}

function _getCollection(name) {
    return db.collection(name);
}

function _connect(callback) {
    var uri = config.db.uri + (config.api.test ? 'Test' : '');

    MongoClient.connect(
        uri,
        function (err, database) {
            db = database;
            callback(err);
        }
    );
}

function _initialize(callback) {
    callback = callback || function () {
        };

    console.info('Database initialization :');
    var beers = _getCollection(CollectionsNames.BEERS);

    async.waterfall([
        function (cb) {
            beers.count(cb);
        },
        function (beerCount, cb) {
            if (beerCount) {
                console.log('Database already initialized.');
                return callback();
            }
            db.dropDatabase(cb);
        },
        function (result, cb) {
            console.info('  Creating indexes...');
            db.ensureIndex(
                'beers',
                {name: 'text'},
                cb
            );
        },
        function (result, cb) {
            console.info('  Inserting data...');
            beers.insertMany(merge.getMergedData(), cb);
        }
    ], function (err) {
        if (err) {
            console.error(err.message);
        } else {
            console.info('Database initialized.');
        }
        callback(err);
    });
}

function _finalize() {
    db.close();
}