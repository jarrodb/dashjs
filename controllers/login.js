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

  app.post('/login', function(req, res, next) {
    passport.authenticate('user', function(err, user, info) {
      if (err) return next(err);
      if (!user)
        return res.render('login', {error: 'login incorrect'});

      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/channel');
      });
    })(req, res, next);
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });
}

