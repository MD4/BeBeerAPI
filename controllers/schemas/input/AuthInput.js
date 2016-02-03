var CommonSchemas = require('./CommonSchemas');

module.exports.auth = {
    properties: {
        body: {
            type: 'object',
            properties: {
                username: CommonSchemas.username,
                password: CommonSchemas.password
            }
        }
    }
};

module.exports.getAuth = {};

module.exports.deleteAuth = {};