var restify = require('restify');
var async = require('async');
var revalidator = require('revalidator');
var PotatoMasher = require('potato-masher');

var session = require('express-session')
var MongoStore = require('connect-mongo')({
    session: session
});

var config = require('./config/config');

var DatabaseHelper = require('./helpers/DatabaseHelper');
var Schemas = require('./controllers/schemas/Schemas');

var configControllers = require('./controllers/config/controllers');

var server = restify.createServer(config.api.info);

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.api.secret,
    store: new MongoStore({
        url: config.db.uri,
        collection: config.db.sessionCollection
    })
}));

server.on('uncaughtException', function (req, res, route, error) {
    console.error(route);
    console.error(error.stack);
    res.send(new restify.errors.InternalServerError('Something wrong happened!'));
});

// database initialization

async.series([
    DatabaseHelper.connect,
    DatabaseHelper.initialize
], function (err) {
    if (err) {
        return console.error('Unable to start server.\nCause: %s', err);
    }
    server.listen(
        config.api.port,
        function () {
            console.log('%s listening at %s', server.name, server.url);
        }
    );
});

// url mapping

Object
    .keys(configControllers)
    .forEach(function (controllerName) {
        var controller = require('./controllers/' + controllerName + 'Controller');
        var actions = configControllers[controllerName];
        actions.forEach(function (actionName) {
            server[controller[actionName].method](
                controller[actionName].url,
                function (req, res, next) {
                    console.log(Schemas);
                    var validation = revalidator.validate(
                        {
                            params: req.params,
                            body: req.body
                        },
                        Schemas.input[controllerName][actionName],
                        {cast: true}
                    );
                    var mapper = PotatoMasher.cmap(
                        Schemas.output[controllerName][actionName],
                        {keep: true, removeChanged: true}
                    );
                    if (!validation.valid) {
                        res.statusCode = 400;
                        res.send({
                            code: 'InvalidRequest',
                            message: 'The sent request is invalid.',
                            errors: validation.errors
                        });
                        return;
                    }

                    res.charSet('utf-8');
                    controller[actionName].action(
                        req,
                        function (err, result) {
                            if (err) {
                                return next(err);
                            }
                            result = result || undefined;
                            if (result instanceof Array) {
                                result = result.map(mapper);
                            } else {
                                result = mapper(result);
                            }
                            res.send(result);
                            return next();
                        }
                    );
                }
            );
        });
    });
