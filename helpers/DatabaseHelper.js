var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var Error = require('../errors/Error');
var config = require('../config/config');
var merge = require('../data/merge');
var db;

var CollectionsNames = {
    BEERS: 'beers',
    USERS: 'users'
};

// exports

module.exports.CollectionsNames = CollectionsNames;

module.exports.enableTestMode = _enableTestMode;
module.exports.getDB = _getDB;
module.exports.getCollection = _getCollection;
module.exports.connect = _connect;
module.exports.initialize = _initialize;
module.exports.finalize = _finalize;

// private

function _enableTestMode(cb) {
    config = require('../config/configTest');
    console.log('Test mode enabled.');
    cb();
}

function _getDB() {
    return db;
}

function _getCollection(name) {
    return db.collection(name);
}

function _connect(callback) {
    var uri = config.db.uri + (config.api.test ? 'Test' : '');

    console.log('Database connection: %s', uri);

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

    if (config.api.test) {
        db.dropDatabase();
    }

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