var configControllers = require('../../controllers/config/controllers');

module.exports = Object
    .keys(configControllers)
    .reduce(function (memo, controllerName) {
        memo.input[controllerName] = require('./input/' + controllerName + 'Input');
        memo.output[controllerName] = require('./output/' + controllerName + 'Output');
        return memo;
    }, {
        input: {},
        output: {}
    }, {});