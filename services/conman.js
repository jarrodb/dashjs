/**
 * Manages the pools of sockets per channels
 */

var config = require('../config/config');

var conManagerSingleton = function(io) {
  this.io = io;
  this.channels = {};
}; conManagerSingleton.prototype = {
  sub : function(client, socket, chan) {
    if (typeof chan === 'undefined') chan = config.DEFAULT_CHANNEL;
    if (! this.channels.hasOwnProperty(chan)) this.channels[chan] = {};
    console.log('sub - chans:', this.channels);
    this.channels[chan][socket.id] = {client:client};
  },
  pub : function(type, data, chan) {
    if (typeof chan === 'undefined') chan = config.DEFAULT_CHANNEL;
    console.log('pub called', type, data, chan);
    for (var client in this.channels[chan]) {
      io.sockets.socket(client).emit(type, data);
      console.log('emit called on chan:', chan, type, data);
    }
  },
  unsub : function(socket, chan) {
    // if (typeof chan == 'undefined') chan = config.DEFAULT_CHANNEL;
    delete this.channels[chan][socket.id];
  },
  del : function(socket) {
    for (var chan in this.channels) {
        delete this.channels[chan][socket.id];
    }
  },
};

exports = module.exports = conManagerSingleton;
