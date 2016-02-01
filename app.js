var async = require('async');

var config = require('./config/config');
var configControllers = require('./controllers/config/controllers');

var Server = require('./core/Server');

var DatabaseHelper = require('./helpers/DatabaseHelper');

var processColor = Math.round(Math.random() * 200);

[
    'debug',
    'info',
    'log'
].forEach(patchConsoleFunction);

function patchConsoleFunction(fnName) {
    (function(fn) {
        console[fnName] = function() {
            var args = Array.prototype.slice.apply(arguments);
            args[0] = ' \u001b[38;5;' + processColor + 'm[' + process.pid + ']\u001b[0m ' + args[0];
            fn.apply(console, args);
        };
    })(console[fnName]);
}


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
