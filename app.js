/**
 * Module dependencies.
 */

var argv = require('optimist')
    .usage('Usage: $0 -i [ipv4] -p [port]')
    .alias('p', 'port')
    .alias('i', 'ipv4')
    .argv

var express = require('express')
  , http = require('http')
  , path = require('path')
//  , mongoose = require('mongoose')

var app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server, { log: false })

var config = {}
  , conn = {};

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

// database
//mongoose.connect("mongodb://localhost/seckzydash", {server: {poolSize: 5}});

// controllers
app.post('/showmethemoney', function (req, res, next) {
    // update all dashboards
    for (var key in conn) {
        socket = conn[key];
        if (req.body.url)
            socket.emit('url', req.body.url);
        if (req.body.text)
            socket.emit('text', req.body.text);
    }
    res.send(200);
});

io.sockets.on('connection', function(socket) {
    socket.on('dash', function(hash) {
        conn[hash] = socket;
    });
});
//

server.listen(app.get('port'), config.ipv4 || '127.0.0.1');

exports = module.exports = app
