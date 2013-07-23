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
    level.models.Flag.prototype.find( req.params.hash, function(err, flag) {
      if(err) return res.json(404, { err: 'could not find flag' });
      flag.update(parseInt(req.body.val), function(err) {
        if (err) return res.json(400, 'value bogus');
        return res.json({status:'ok'});
      });
    });
  });

  app.get('/flag/:hash', function(req, res, next) {
    var contype = req.headers['content-type'];
    if (-1 == ['application/json', 'text/html'].indexOf(contype)) {
      return res.send(415, 'unknown content-type');
    }
    res.header("Content-Type", contype);
    level.models.Flag.prototype.find(req.params.hash, function(err,f) {
      if (err) {
        return res.json(500, {err:'unable to retrieve flag'});
      }
      if (contype === 'application/json') return res.send({flag:f.toStr()});
      else if (contype === 'text/html')
        return res.render(
          'flag',
          {flagsym: f.symbol, flagstr: f.toStr(), layout: false}
        );
    });
  });


};
