
process.env.NODE_ENV = 'test';

var app = require('../app');
var level = require('../libs/level');
var request = require('supertest');
var should = require('should');

describe('Flags', function() {
  var flag = null;
  var faker = {
      name    : 'fake'
    , stale   : 60
    , expires : 120
  };

  it('will make a unique hash for each record on creation', function(done) {
    console.log(level.models.Flag);
    var f1 = new level.models.Flag(faker)
      , f2 = new level.models.Flag(faker);
    f1.hash.should.not.equal(f2.hash);
    done();
  });


});

