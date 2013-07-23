/**
 * Module dependencies.
 */


var argv = require('optimist')
    .usage('Usage: $0 -i [ipv4] -p [port]')
    .alias('p', 'port')
    .alias('i', 'ipv4')
    .argv;

// imports
var config = require('./config/config');
var level = require('./libs/level');
var express = require('express');
var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var exphbs = require('express3-handlebars');
var passport = require('passport');
var passportIo = require('passport.socketio');

var LocalStrategy = require('passport-local').Strategy;

// globals
var app = express();
var memoryStore = new express.session.MemoryStore();
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
app.use(express.cookieParser());
app.use(express.session({
  store: memoryStore,
  secret: config.session.secret,
  key: config.session.key,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// models
level.connect(config.root+'/'+config.db_name);
require('./models/user');
require('./models/flag');

// middleware
io.set("authorization", passportIo.authorize({
    cookieParser: express.cookieParser
  , store: memoryStore
  , key: config.session.key
  , secret: config.session.secret
}));

passport.use('user', new LocalStrategy(
  function(username, password, done) {
    var User = level.models.User;
    User.prototype.authenticate(username, password, function(err, user) {
      if (err || ! user)
        return done(null, false);
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  // Delete the password before serializing
  delete user.password;
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// services
var conManagerSingleton = require('./services/conman');
var conman = new conManagerSingleton(io);

// controllers
require('./controllers/channel')(app, conman);
require('./controllers/login')(app);
require('./controllers/api')(app, conman);
require('./controllers/sockets')(app, conman, io);
require('./controllers/flag')(app, level);

server.listen(app.get('port'), app.get('ipv4'));

exports = module.exports = app

