var revalidator = require('revalidator');
var PotatoMasher = require('potato-masher');

var Schemas = require('../controllers/schemas/Schemas');

// exports

module.exports = _ActionHandler;

// private

function _ActionHandler(controller, controllerName, actionName) {
    return function(req, res, next) {
        res.charSet('utf-8');

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
                } else {
                    result = mapper(result);
                }
                res.send(result);
                return next();
            }
        );
    };
}