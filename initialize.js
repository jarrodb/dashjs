
var config = require('./config/config')
var level = require('./libs/level')
level.connect(config.db_name);

console.log(config.db_name);
require('./models/user');

// Initialize Model variables
var User = level.model('User')

var admin = new User({
  fullname: "Administrator",
  username: "admin",
});
admin.set_password("dashing");
console.log(JSON.stringify(admin));
admin.save(function(err) {
  // XXX check for error on this save
  console.log("User "+admin.username+" created successfully");
  process.exit();
});

