var CommonSchemas = require('./CommonSchemas');

module.exports.getBeers = {
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

module.exports.getBeer = {
    properties: {
        params: {
            type: 'object',
            properties: {
                id: CommonSchemas.beerId
            }
        }
    }
};

module.exports.rateBeer = {
    properties: {
        params: {
            type: 'object',
            properties: {
                id: CommonSchemas.beerId
            }
        },
        body: {
            type: 'object',
            properties: {
                rating: CommonSchemas.rating
            }
        }
    }
};