/**
 * Data Controllers
 */

var config = require('../config/config');

module.exports = function(app) {
  // el viewer
  // for now, just send plain text but wrap this in something prettier later
  app.get('/channel/:chan?', function genText(req, res, next) {
    var chan = req.params.chan || config.DEFAULT_CHANNEL;
    res.render(
      'channel',
      { baseuri : config.baseuri, channel : chan }
    );
  });

}
