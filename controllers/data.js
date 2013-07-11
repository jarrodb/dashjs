/**
 * Data Controllers
 */

var config = require('../config/config');

module.exports = function(app, io, db) {
  // controllers
  app.post('/broadcast', function (req, res, next) {
    // update all dashboards
    var chan = req.params[0] || config.DEFAULT_CHANNEL;
    var content = {
      type : (req.body.url) ? 'url' : 'text',
      payload : req.body.url || req.body.text
    };

    db.createReadStream({
      start: chan+'~',
      end: chan+'\xFF'
    })
    .on('data', function(data) {
      var socketid = data.value;
      console.log('we got data: ');
      console.log(socketid);
      io.sockets.socket(socketid).emit(content.type, content.payload);
    })
    res.send(200);
  });

  // text page.
  // for now, just send plain text but wrap this in something prettier later
  app.get('/text', function genText(req, res, next) {
    var text = req.query['body'];
    res.send(text);
  });
}

