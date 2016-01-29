var async = require('async');

var config = require('./config/config');
var configControllers = require('./controllers/config/controllers');

var Server = require('./core/Server');

var DatabaseHelper = require('./helpers/DatabaseHelper');


// App initialization

async.series([
    DatabaseHelper.connect,
    DatabaseHelper.initialize
], function (err) {
    if (err) {
        return console.error('Unable to start server.\nCause: %s', err);
    }
    var server = new Server(config, configControllers);
    server.start();
});
