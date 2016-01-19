var Error = function (type, message) {
    this.type = type;
    this.message = message;
};

Error.INFO = 'info';

module.exports = Error;