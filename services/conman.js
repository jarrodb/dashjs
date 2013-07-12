/**
 * Manages the pools of sockets per channels
 */

var config = require('../config/config');

var conManagerSingleton = {
  channels : {},
  sub : function(client, socket, chan) {
    if (typeof chan === 'undefined') chan = config.DEFAULT_CHANNEL;
    if (! this.channels.hasOwnProperty(chan)) this.channels[chan] = {};
    console.log('sub - chans:', this.channels);
    //console.log('sub called with', chan, client, socket);
    this.channels[chan][client] = {socket:socket};
  },
  pub : function(type, data, chan) {
    if (typeof chan === 'undefined') chan = config.DEFAULT_CHANNEL;
    console.log('pub called', type, data, chan);
    for (var client in this.channels[chan]) {
      var socket = this.channels[chan][client].socket;
      socket.emit(type, data);
      console.log('emit called on chan:', chan, type, data);
    }
  },
  del : function(client, chan) {
    if (typeof chan == 'undefined') chan = config.DEFAULT_CHANNEL;
    delete this.channels[chan][client];
  }
};

module.exports = conManagerSingleton;
