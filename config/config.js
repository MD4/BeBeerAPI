var npmPackage = require('../package.json');

module.exports = {
    api: {
        info: {
            name: npmPackage.name,
            version: npmPackage.version,
            repository: npmPackage.repository,
            bugs: npmPackage.bugs,
            homepage: npmPackage.homepage
        },
        port: process.env.PORT || 8081,
        secret: process.env.SECRET || 'this is not the production secret lol',
        test: false
    },
    db: {
        uri: process.env.MONGODB_ADDON_URI || 'mongodb://127.0.0.1:27017/bebeer',
        sessionCollection: 'sessions'
    },
    session: {
        uri: process.env.REDIS_URL || 'redis://localhost:6379',
        db: +process.env.REDIS_DB || 0
    }
};