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

module.exports.getDB = getDB;
module.exports.getCollection = getCollection;
module.exports.connect = connect;
module.exports.initialize = initialize;
module.exports.finalize = finalize;

// private

function getDB() {
    return db;
}

function getCollection(name) {
    return db.collection(name);
}

function connect(callback) {
    var url = 'mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name;

    MongoClient.connect(url, function (err, database) {
        db = database;
        callback(err);
    });
}

function initialize(callback) {
    callback = callback || function () {
        };

    console.info('Database initialization :');
    var beers = getCollection(CollectionsNames.BEERS);

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

function finalize() {
    db.close();
}