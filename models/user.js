/*
 * User
 */

var level = require('../libs/level');
var bcrypt = require('bcrypt');

var User = level.Model({
  fullname    : {type: String},
  username    : {type: String},
  created_at  : {type: Date, default: function(){return new Date();}},
  password    : {type: String, required: true}
},{
  key: 'username',
  set_password: function(password) {
    this.password = bcrypt.hashSync(password, 8);
  },
  authenticate: function(username, password, cb) {
    level.db.get(this.key+'~'+username, function(err, user) {
      if (err) return cb(err);

      var user = JSON.parse(user);
      if (bcrypt.compareSync(password, user.password))
        return cb(null, user);
      return cb(new Error("invalid authentication"));
    });
  },
  validate: function() {
    if (!this.password) return new Error('password required');
  }
});

level.model('User', User);

