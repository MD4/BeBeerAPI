module.exports = {

    beerId: {
        description: 'the id of the beer',
        type: 'string',
        pattern: '^[0-9]+$',
        required: true,
        maxLength: 10
    },

    username: {
        type: 'string',
        default: '',
        format: /^[a-z0-9\-_]+$/,
        minLength: 3,
        maxLength: 50,
        required: true
    },

    email: {
        type: 'string',
        format: 'email',
        default: '',
        required: true
    },

    password: {
        type: 'string',
        default: '',
        minLength: 6,
        maxLength: 50,
        required: true
    }

};