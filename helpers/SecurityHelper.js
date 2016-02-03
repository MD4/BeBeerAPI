var crypto = require('crypto');

// exports

module.exports.hash = _hash;

// private

function _hash(input) {
    return crypto.createHash('sha1').update(input).digest('hex')
}
