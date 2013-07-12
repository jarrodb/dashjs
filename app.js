/**
 * Module dependencies.
 */


var argv = require('optimist')
    .usage('Usage: $0 -i [ipv4] -p [port]')
    .alias('p', 'port')
    .alias('i', 'ipv4')
    .argv;

// imports
var config = require('./config/config')
var express = require('express');
var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var level = require('levelup');
var exphbs = require('express3-handlebars');

// globals
var app = express();
var db = level('./dashdb');

var server = http.createServer(app);
io = socketio.listen(server, { log: true });

// setup express environment
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('ipv4', argv.i || config.listen.ipv4);
app.set('port', argv.p || config.listen.port);
app.set('env', process.env.NODE_ENV || 'production');
app.disable('x-powered-by');
app.use(express.static(__dirname + '/client'));
app.use(express.bodyParser());


// services
var conManagerSingleton = require('./services/conman');
var conman = new conManagerSingleton(io);

// controllers
require('./controllers/channel')(app, conman);
require('./controllers/api')(app, conman);
require('./controllers/sockets')(app, conman, io);


server.listen(app.get('port'), app.get('ipv4'));

exports = module.exports = app

