var MethodVisibility = require('../../constants/MethodVisibility');

module.exports = {
    Root: [
        {action: 'get', visibility: MethodVisibility.PUBLIC}
    ],
    Beer: [
        {action: 'getBeers', visibility: MethodVisibility.PRIVATE},
        {action: 'getBeer', visibility: MethodVisibility.PRIVATE}
    ],
    Brewery: [
        {action: 'getBreweries', visibility: MethodVisibility.PRIVATE}
    ],
    User: [
        {action: 'createUser', visibility: MethodVisibility.PUBLIC},
        {action: 'getUser', visibility: MethodVisibility.PRIVATE}
    ],
    Auth: [
        {action: 'auth', visibility: MethodVisibility.PUBLIC},
        {action: 'getAuth', visibility: MethodVisibility.PRIVATE},
        {action: 'deleteAuth', visibility: MethodVisibility.PRIVATE}
    ]
};