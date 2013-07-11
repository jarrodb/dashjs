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
var config = require('./config').config;
var express = require('express');
var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var exphbs = require('express3-handlebars');

// globals
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

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
var config = {port: argv.i, ipv4: argv.i};
var server = http.createServer(app);
var io = socketio.listen(server, { log: true });

// setup express environment
app.set('port', config.port || 3000);
app.set('ipv4', config.ipv4 || '127.0.0.1');
app.set('env', process.env.NODE_ENV || 'production');
app.disable('x-powered-by');
app.use(express.static(__dirname + '/client'));
app.use(express.bodyParser());

// controllers
app.post('/broadcast/:chan?', function (req, res, next) {
  // update all dashboards
  var chan = req.params.chan || DEFAULT_CHANNEL;
  var content = {
    type : (req.body.url) ? 'url' : 'text',
    payload : req.body.url || req.body.text
  };
  connMaster.broadcast(chan, content);
  res.send(200);
});

// el viewer
// for now, just send plain text but wrap this in something prettier later
app.get('/channel/:chan', function genText(req, res, next) {
  var chan = req.params.chan || DEFAULT_CHANNEL;
  res.render(
    'channel',
    { baseuri : config.baseuri }
  );
});

app.get('/channel', function genText(req, res, next) {
  res.redirect('/channel/' + DEFAULT_CHANNEL);
});

// text page.
// for now, just send plain text but wrap this in something prettier later
app.get('/text', function genText(req, res, next) {
  var text = req.query['body'];
  res.send(text);
});

// socket io events
io.sockets.on('connection', function(socket) {
  socket.on('dash', function(hash, channel) {
    if(!channel) channel = DEFAULT_CHANNEL;
    connMaster.addToChan(channel, hash, socket);
  });
});

server.listen(app.get('port'), app.get('ipv4'));

exports = module.exports = app
