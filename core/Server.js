var restify = require('restify');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

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

    this.api.use(function (req, res, next) {
        req.body = req.body || {};
        req.params = req.params || {};
        next();
    });

    this.api.use(session({
        saveUninitialized: true,
        resave: true,
        secret: this.config.api.secret,
        store: new RedisStore({
            url: this.config.session.uri,
            db: this.config.session.db
        })
    }));

    this.api.use(function (req, res, next) {
        if (!req.session) {
            return next(new restify.errors.InternalServerError('Something wrong happened! [err#js-r-1]'));
        }
        next();
    });

    // Enabling CORS
    this.api.use(restify.CORS({ credentials: true }));

    this.api.on('uncaughtException', function (req, res, route, error) {
        console.error(route);
        console.error(error.stack);
        res.send(new restify.errors.InternalServerError('Something wrong happened! [err#js-ue-1]'));
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
            var actions = this.configControllers[ controllerName ];
            actions.forEach(function (actionConfig) {
                var actionName = actionConfig.action;
                var action = controller[ actionName ];
                console.log('[URL MAPPING] %s:%s -> %s %s', controllerName, actionName, action.method, action.url);
                this.api[ action.method ](
                    controller[ actionName ].url,
                    new ActionHandler(controller, controllerName, actionConfig)
                );
            }.bind(this));
        }.bind(this));
};