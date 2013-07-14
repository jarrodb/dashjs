/**
 * Data Controllers
 */

var config = require('../config/config');
var mw = require('../libs/middleware');

var genText = function(req, res, next) {
  var chan = req.params.chan || config.DEFAULT_CHANNEL;
  res.render(
    'channel',
    { baseuri : config.baseuri, channel : chan, user: req.user.username }
  );
}

module.exports = function(app) {
  // el viewer
  // for now, just send plain text but wrap this in something prettier later
  app.get(
    '/',
    mw.loginRequired,
    function(req, res) {
      res.redirect('/channel');
  });

  app.get('/channel/:chan?', mw.loginRequired, genText);
}
