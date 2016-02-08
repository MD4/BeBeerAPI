var config = require('../config/config');
var HTTPMethod = require('../constants/HTTPMethod');
var configController = require('../controllers/config/controllers');

// exports

module.exports.get = _get();

// private

var _actions = _getActions();

function _get() {
    return {
        method: HTTPMethod.GET,
        url: '/',
        action: function (req, callback) {
            callback(null, {
                api: config.api.info,
                actions: _actions
            });
        }
    };
}

function _getActions() {
    return Object
        .keys(configController)
        .reduce(function (memo, controllerName) {
            var controller = require('../controllers/' + controllerName + 'Controller');
            var actions = configController[controllerName];
            memo[controllerName] = actions.reduce(function (memo, actionConfig) {
                var actionName = actionConfig.action;
                var action = controller[actionName];
                memo[actionName] = {
                    endpoint: action,
                    schema: require('../controllers/schemas/input/' + controllerName + 'Input')[actionName]
                };
                return memo;
            }, {});
            return memo;
        }, {});
}