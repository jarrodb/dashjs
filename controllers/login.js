/**
 * Data Controllers
 */

var passport = require('passport');
var config = require('../config/config');

module.exports = function(app) {
  // el viewer
  // for now, just send plain text but wrap this in something prettier later
  app.get(
    '/login',
    function(req, res, next) {
      res.render('login');
    }
  );

  app.post(
    '/login',
    passport.authenticate('user', {
      successRedirect: '/channel',
      failureRedirect: '/login'
    })
  );

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });
}

