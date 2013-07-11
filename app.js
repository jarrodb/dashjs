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
var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var level = require('level');

// globals
var app = express();
var config = require('./config/config')
var db = level('./dashdb');

var server = http.createServer(app);
var io = socketio.listen(server, { log: true });

// setup express environment
app.set('ipv4', argv.i || config.listen.ipv4);
app.set('port', argv.p || config.listen.port);
app.set('env', process.env.NODE_ENV || 'production');
app.disable('x-powered-by');
app.use(express.static(__dirname + '/client'));
app.use(express.bodyParser());

// controllers
require('./controllers/data')(app, io, db);
require('./controllers/sockets')(io, db);

server.listen(app.get('port'), app.get('ipv4'));

exports = module.exports = app
