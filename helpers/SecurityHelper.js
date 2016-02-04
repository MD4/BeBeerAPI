var crypto = require('crypto');

// exports

module.exports.sha1 = _sha1;
module.exports.md5 = _md5;

// private

function _sha1(input) {
    return crypto
        .createHash('sha1')
        .update(input)
        .digest('hex');
}


function _md5(input) {
    return crypto
        .createHash('md5')
        .update(input)
        .digest('hex');
}
