var CommonSchemas = require('./CommonSchemas');

module.exports.getBreweries = {
    properties: {
        params: {
            type: 'object',
            properties: {
                count: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 30,
                    default: 20
                },
                offset: {
                    type: 'integer',
                    minimum: 0,
                    default: 0
                },
                name: {
                    type: 'string',
                    default: '',
                    minLength: 1,
                    maxLength: 100
                }
            }
        }
    }
};

module.exports.getBrewery = {
    properties: {
        params: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    default: '',
                    minLength: 1,
                    maxLength: 100
                }
            }
        }
    }
};

module.exports.getBeers = {
    properties: {
        params: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    default: '',
                    minLength: 1,
                    maxLength: 100
                }
            }
        }
    }
};