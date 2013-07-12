/**
 * Data Controllers
 */

module.exports = function(app, conman) {

  // controllers
  app.post('/broadcast/?:chan?', function (req, res, next) {
    // update all dashboards
    var chan = req.params.chan;
    var type = req.body.type;
    var data = req.body.data;
    conman.pub(type, data, chan);
    res.send(200);
  });

};
