var restify = require('restify');
var async = require('async');
var DatabaseHelper = require('./helpers/DatabaseHelper');

var server = restify.createServer({
    name: 'bebeerapi',
    version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// database initialization

async.series([
    DatabaseHelper.connect,
    DatabaseHelper.initialize
], function (err) {
    if (err) {
        return console.error('Unable to start server.\nCause:\n', err);
    }
    server.listen(8080, function () {
        console.log('%s listening at %s', server.name, server.url);
    });
});

// url mapping

var configControllers = {
    BeerController: [
        'getBeers',
        'getBeer'
    ]
};

Object
    .keys(configControllers)
    .forEach(function (controllerName) {
        var controller = require('./controllers/' + controllerName);
        var actions = configControllers[controllerName];
        actions.forEach(function (actionName) {
            server[controller[actionName].method](
                controller[actionName].url,
                function (req, res, next) {
                    res.charSet('utf-8');
                    controller[actionName].action(
                        req,
                        function (err, result) {
                            if (err) {
                                return next(err);
                            }
                            res.send(result || undefined);
                            return next();
                        }
                    );
                }
            );
        });
    });
