/**
 * Flag Controllers
 */

module.exports = function(app, level) {

  app.post('/flag', function (req, res, next) {
    // NEW FLAG OH BOY!
    var name = req.body.name;
    if (!name) return res.json(400, {err: 'name required'});
    var flag = new level.models.Flag({name:name});
    flag.save(function(e){});
    res.json({flag:flag.hash});
  });

  app.post('/flag/:hash', function(req, res, next) {
    // UPDATE YO FLAG
    level.models.Flag.prototype.find( req.params.hash, function(err, doc) {
      if(err) return res.json(404, { err: 'could not find flag' });

    });
  });


};
