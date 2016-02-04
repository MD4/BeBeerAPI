var revalidator = require('revalidator');
var PotatoMasher = require('potato-masher');
var restify = require('restify');

var Schemas = require('../controllers/schemas/Schemas');
var MethodVisibility = require('../constants/MethodVisibility');

var AuthController = require('../controllers/AuthController');

// exports

module.exports = _ActionHandler;

// private

function _ActionHandler(controller, controllerName, actionConfig) {
    return function(req, res, next) {
        var actionName = actionConfig.action;
        res.charSet('utf-8');

        if(actionConfig.visibility === MethodVisibility.PRIVATE) {
            if (!AuthController.getAuthUser(req))
            return next(new restify.errors.UnauthorizedError('You must be logged in to do this.'));
        }

        // Input validator
        var validation = revalidator.validate(
            {
                params: req.params,
                body: req.body
            },
            Schemas.input[controllerName][actionName],
            {cast: true}
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

        // Output mapper
        var mapper = PotatoMasher.cmap(
            Schemas.output[controllerName][actionName],
            {keep: true, removeChanged: true}
        );

        // Action handling
        controller[actionName].action(
            req,
            function (err, result) {
                if (err) {
                    return next(err);
                }
                result = result || undefined;
                if (result instanceof Array) {
                    result = result.map(mapper);
                } else if(result !== undefined) {
                    result = mapper(result);
                }
                res.send(result);
                return next();
            }
        );
    };
}