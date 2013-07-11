/**
 * Module dependencies.
 */

var config = {
    // dash config
    baseuri : 'http://localhost:3000',
    DEFAULT_CHANNEL: 'default',

    // server config
    listen: {
        ipv4: '127.0.0.1',
        port: 3000
    }
}

try {
    var local_config = require('./local');
    for (var prop in local_config)
        config[prop] = local_config[prop];
} catch(e) {}

module.exports = config;

