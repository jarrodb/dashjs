
process.env.NODE_ENV = 'test';

var app = require('../app');
var level = require('../libs/level');
var request = require('supertest');
var should = require('should');

describe('Authentication', function() {
    var cookie = '';
    var admin = '';

    var dummy = {
        fullname: "Dummy",
        username: "dummy",
        password: "testme"
    };

    before(function(done) {
        // add a user
        var User = level.model('User')
        admin = new User(dummy)
        admin.set_password(dummy.password);
        admin.save(function(err) {
            done();
        });
    });

    after(function(done) {
        admin.remove(function(err) {
            done();
        });
    });

    it('will fail to authenticate', function(done) {
        request(app).post('/login')
            .send({username: dummy.username, password: "whatwhat"})
            .end(function(err, res) {
                res.should.have.status(200);
                res.text.should.include('login incorrect');
                done();
            });
    });

    it('will authenticate successfully', function(done) {
        request(app).post('/login')
            .send({username: dummy.username, password: dummy.password})
            .end(function(err, res) {
                res.should.have.status(302);
                res.headers.should.have.property('location');
                res.headers.location.should.equal('/channel');
                cookie = res.headers['set-cookie'];
                done();
            });
    });
});
