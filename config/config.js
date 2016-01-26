module.exports = {
    api: {
        info: {
            name: 'bebeerapi',
            version: '1.0.0'
        },
        port: process.env['PORT'] || 8081
    },
    db: {
        uri: process.env['MONGODB_ADDON_URI'] || 'mongodb://127.0.0.1:27017/bebeer'
    }
};