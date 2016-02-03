var CommonSchemas = require('./CommonSchemas');

module.exports.createUser = {
    properties: {
        body: {
            type: 'object',
            properties: {
                username: CommonSchemas.username,
                email: CommonSchemas.email,
                password: CommonSchemas.password
            }
        }
    }
};

module.exports.getUser = {
    properties: {
        params: {
            type: 'object',
            properties: {
                id: CommonSchemas.username
            }
        }
    }
};