var restify = require('restify');
var session = require('express-session')
var MongoStore = require('connect-mongo')({
    session: session
});

var ActionHandler = require('../core/ActionHandler');

// exports

module.exports = _Server;

// private


function _Server(config, configControllers) {
    this.config = config;
    this.configControllers = configControllers;

    this.api = restify.createServer(this.config.api.info);

    this.api.use(restify.acceptParser(this.api.acceptable));
    this.api.use(restify.queryParser());
    this.api.use(restify.bodyParser());

    this.api.use(session({
        saveUninitialized: true,
        resave: true,
        secret: this.config.api.secret,
        store: new MongoStore({
            url: this.config.db.uri,
            collection: this.config.db.sessionCollection
        })
    }));

    this.api.on('uncaughtException', function (req, res, route, error) {
        console.error(route);
        console.error(error.stack);
        res.send(new restify.errors.InternalServerError('Something wrong happened!'));
    });

    this.mapUrls();
}

_Server.prototype.start = function () {
    this.api.listen(
        this.config.api.port,
        function () {
            console.log('%s listening at %s', this.api.name, this.api.url);
        }.bind(this)
    );
};

_Server.prototype.mapUrls = function () {
    Object
        .keys(this.configControllers)
        .forEach(function (controllerName) {
            var controller = require('../controllers/' + controllerName + 'Controller');
            var actions = this.configControllers[controllerName];
            actions.forEach(function (actionName) {
                this.api[controller[actionName].method](
                    controller[actionName].url,
                    new ActionHandler(controller, controllerName, actionName)
                );
            }.bind(this));
        }.bind(this));
};