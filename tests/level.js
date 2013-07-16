
process.env.NODE_ENV = 'test';

var app = require('../app');
var level = require('../libs/level');
var should = require('should');

describe('Level CRUD tests', function() {
    var User = level.model('User');
    var user = '';

    it('will fail creating a user without a key', function(done) {
        var fail = new User({fullname: 'Billy Bob'})
        fail.save(function(err, doc) {
            should.not.exist(doc);
            err.message.should.equal('key cannot be empty');
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


    it('will create a user successfully', function(done) {
        var success = new User({
            fullname: 'Billy Bob',
            username: 'billy'
        })
        success.set_password('baitshop');
        success.save(function(err) {
            should.not.exist(err);
            done();
        });
    });

    it('will find the user', function(done) {
        User.prototype.find('billy', function(err, doc) {
            should.not.exist(err);
            doc.should.have.property('username');
            doc.username.should.equal('billy');
            user = doc;
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
