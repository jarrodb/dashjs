
process.env.NODE_ENV = 'test';

var app = require('../app');
var level = require('../libs/level');
var should = require('should');

describe('Level CRUD tests', function() {
    var User = level.models.User;
    var user = null;

    it('will let me pass a callable for default', function(done) {
      user = new User({username:'fakie'});
      user.created_at.should.be.an.instanceOf(Date);
      done();
    });

    it('will fail creating a user without a key', function(done) {
        var fail = new User({fullname: 'Billy Bob'})
        fail.save(function(err, doc) {
            should.not.exist(doc);
            err.message.should.equal('_key cannot be empty');
            done();
        });
    });

    it('will fail creating a user without a password', function(done) {
        var success = new User({username: 'nosucceed'})
        success.save(function(err) {
            err.message.should.equal('password is a required field');
            done();
        });
    });

    it('will create and save a user successfully', function(done) {
      var newU = new User({ username: 'billy' })
      newU.set_password('baitshop');
      newU.save(function(err) {
        should.not.exist(err);
        User.prototype.find('billy', function(err,u) {
          should.not.exist(err);
          should.exist(u);
          done();
        });
      });
    });

    it('will not find the user', function(done) {
        User.prototype.find('jimmyhoffa', function(err, doc) {
            should.exist(err);
            should.not.exist(doc);
            done();
        });
    });

    it('will delete the user', function(done) {
        user.remove(function(err) {
            should.not.exist(err);
            done();
        });
    });

});
