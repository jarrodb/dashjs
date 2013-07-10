/**
 * Module dependencies.
 */


var DEFAULT_CHANNEL = 'default';

var argv = require('optimist')
    .usage('Usage: $0 -i [ipv4] -p [port]')
    .alias('p', 'port')
    .alias('i', 'ipv4')
    .argv;

// imports
var express = require('express');
var app = require('express')();
var http = require('http');
var path = require('path');
var socketio = require('socket.io');

// globals
var app = express();

var connMaster = {
  channels : {default:{}},
  addToChan : function(chan, hash, socket) {
    if (! chan in connMaster.channels) connMaster.channels[chan] = {};
    connMaster.channels[chan][hash] = socket;
  },
  broadcast : function(chan, content) {
    if (! chan in connMaster.channels) {
      return;
    }
    for (var key in connMaster.channels[chan]) {
      var socket = connMaster.channels[chan][key];
      socket.emit(content.type, content.payload);
    }
  }
};
var config = {};
var server = http.createServer(app);
var io = socketio.listen(server, { log: false });

// Load port from args
if (argv.p || argv.i) {
    config.port = argv.p;
    config.ipv4 = argv.i;
}

// setup express environment
app.set('port', config.port || 3000);
app.set('env', process.env.NODE_ENV || 'production');
app.disable('x-powered-by');
app.use(express.static(__dirname + '/client'));
app.use(express.bodyParser());

// controllers
app.post('/broadcast', function (req, res, next) {
  // update all dashboards
  var chan = req.params[0] || DEFAULT_CHANNEL;
  var content = {
    type : (req.body.url) ? 'url' : 'text',
    payload : (req.body.url) ? req.body.url : req.body.text
  };
  connMaster.broadcast(chan, content);
  res.send(200);
});

// text page.
// for now, just send plain text but wrap this in something prettier later
app.get('/text', function genText(req, res, next) {
  var text = req.query['body'];
  res.send(text);
});

io.sockets.on('connection', function(socket) {
  socket.on('dash', function(hash, channel) {
    if(!channel) channel = DEFAULT_CHANNEL;
    connMaster.addToChan(channel, hash, socket);
  });
});

server.listen(app.get('port'), config.ipv4 || '127.0.0.1');

exports = module.exports = app
