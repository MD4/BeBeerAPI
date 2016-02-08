var CustomError = function (type, message) {
    this.type = type;
    this.message = message;
};

CustomError.INFO = 'info';

module.exports = CustomError;