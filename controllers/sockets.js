/**
 * socket io events
 */

var config = require('../config/config');

module.exports = function(app, conman) {
  conman.io.sockets.on('connection', function(socket) {
    socket.on('dash', function(username, chan) {
      if (typeof chan === 'undefined') chan = config.DEFAULT_CHANNEL;
      conman.sub(username, socket, chan);
    });
    socket.on('disconnect', function () {
      conman.del(socket);
    });
  });
}

