// socket io events

var config = require('../config/config');

module.exports = function(io, db) {
  io.sockets.on('connection', function(socket) {
    socket.on('dash', function(hash, channel) {
      if(!channel) channel = config.DEFAULT_CHANNEL;

      db.put(channel+'~'+hash, socket.id, function (err) {
        if (err) return console.log('Ooops!', err)
      });
    });
    socket.on('disconnect', function () {
        // delete from leveldb
    });
  });
}
