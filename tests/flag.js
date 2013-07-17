
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

});


describe('Flag controllers', function() {
  var shared_flag = null;

  it('making a new flag want a name', function(done) {
    request(app).post('/flag')
      .send({ this_is_not_a_name : 'yohomie' })
      .end(function(err, res) {
        res.should.have.status(400);
        res.text.should.include('name required');
        done();
      });
  });

  it('makes a new flag', function(done) {
    request(app).post('/flag')
      .send({ name : 'yohomie' })
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.should.have.property('flag');
        res.body.flag.should.not.be.empty;

        var Flag = level.models.Flag.prototype.find(
          res.body.flag,
          function(err, flag) {
            shared_flag = flag;
            flag.should.not.be.null;
          }
        );

        done();
      });
  });

  it('can not find a flag', function(done) {
    request(app).post('/flag/notthere')
      .send({})
      .end(function(err, res) {
        res.should.have.status(404);
        done();
      });
  });

  /*

  it('updates a flag', function(done) {
    request(app).post('/flag/' + shared_flag.hash)
      .send({ val : 1 })
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });
  */





});

