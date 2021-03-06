/**
 * Module dependencies.
 */

var path = require('path');

var config = {
    // dash config
    baseuri : 'http://127.0.0.1:3000',
    db_name : 'dashdb',
    DEFAULT_CHANNEL: 'default',

    // server config
    root    : path.resolve(__dirname, '/..'),

    listen: {
      ipv4: '127.0.0.1',
      port: 3000
    },

    session: {
      secret: 'eifohweifnewiofewfew',
      key: 'express.sid'
    }
}

try {
    var local_config = require('./local');
    for (var prop in local_config)
        config[prop] = local_config[prop];
} catch(e) {}

module.exports = config;

