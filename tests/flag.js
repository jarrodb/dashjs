
process.env.NODE_ENV = 'test';

var app = require('../app');
var level = require('../libs/level');
var request = require('supertest');
var should = require('should');

describe('Flags CRUD', function() {

  var flag = null;
  var faker = {
      name    : 'fake'
    , stale   : 60
    , expires : 120
  };

  it('will make a unique hash for each record on creation', function(done) {
    var f1 = new level.models.Flag(faker)
      , f2 = new level.models.Flag(faker);
    f1.hash.should.not.equal(f2.hash);
    done();
  });

  it('put my new flag in the db', function(done) {
    var f = new level.models.Flag({name:'newflag'});
    f.save(function(err) {
      should.not.exist(err);
      level.models.Flag.prototype.find(f.hash, function(err, doc) {
        should.not.exist(err);
        should.exist(doc);
        done();
      });
    });
  });

  it('updates a flag', function(done) {
    var f = new level.models.Flag({name:'mutant'});
    f.save(function(err){
      should.not.exist(err);
      f.update('ok', function(err) {
        should.not.exist(err);
        f.state.should.equal('ok');
        done();
      });
    });
  });

});


describe('Flag controllers', function() {

  it('does not recognize content-type', function(done) {
    request(app).get('/flag/somethingbogus')
    .set('Content-Type', 'donot/know')
    .end(function(err, res) { res.should.have.status(415); done()});
  });

  it('hands out a flag in html', function(done) {
    var f = new level.models.Flag({name:'kickflip'});
    f.save(function(err) {
      should.not.exist(err);
      request(app).get('/flag/'+f.hash)
      .set('Content-Type','text/html')
      .end(function(err, res) {
        res.should.have.status(200);
        should.not.exist(err);
        res.text.should.include('flag-fail');
        done();
      });
    });
  });

  it('hands out a flag in json', function(done) {
    var f = new level.models.Flag({name:'fakie180'});
    f.save(function(err) {
      should.not.exist(err);
      request(app).get('/flag/'+f.hash)
      .set('Content-Type','application/json')
      .end(function(err, res) {
        res.should.have.status(200);
        should.not.exist(err);
        res.body.flag.should.equal('fail');
        done();
      });
    });
  });

  it('wants a name', function(done) {
    request(app).post('/flag')
      .set('Content-Type', 'application/json')
      .send({ this_is_not_a_name : 'yohomie' })
      .end(function(err, res) {
        res.should.have.status(400);
        res.text.should.include('name required');
        done();
      });
  });

  it('makes a new flag', function(done) {
    request(app).post('/flag')
      .set('Content-Type', 'application/json')
      .send({ name : 'yohomie' })
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.should.have.property('flag');
        res.body.flag.should.not.be.empty;
        var newFlagKey = res.body.flag;
        level.models.Flag.prototype.find( newFlagKey, function(err, f) {
            should.not.exist(err);
            f.should.be.an.instanceOf(level.models.Flag);
            done();
          }
        );

      });
  });

  it('cannot find a flag', function(done) {
    request(app).post('/flag/notthere')
      .send({})
      .end(function(err, res) {
        res.should.have.status(404);
        done();
      });
  });

  it('updates a flag wrongly', function(done) {
    var f = new level.models.Flag({name:'dinohunter'});
    f.save(function(err){
      should.not.exist(err);
      request(app).post('/flag/' + f.hash)
        .send({ state : 'ok' })
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        });
    });
  });

  it('updates a flag correctly', function(done) {
    var f = new level.models.Flag({name:'turok'});
    f.save(function(err){
      should.not.exist(err);
      request(app).post('/flag/' + f.hash)
      .send({ state : 43 })
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
    });
  });

});

