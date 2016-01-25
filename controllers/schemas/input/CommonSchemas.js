module.exports = {

    beerId: {
        description: 'the id of the beer',
        type: 'string',
        pattern: '^[0-9]+$',
        required: true,
        maxLength: 10
    }

};