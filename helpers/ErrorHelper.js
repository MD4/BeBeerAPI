var restify = require('restify');

// exports

module.exports.handleError = _handleError;

// private

function _handleError(err) {
    switch (err.code) {
        case 11000:
            return new restify.errors.ConflictError('Duplicated id');
        default:
            return new restify.errors.InternalServerError('Oops. Something gone wrong!');
    }
}