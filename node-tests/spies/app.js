// HAS TO BE A VAR - NOT CONST!!!
// OTHERWISE REWIRE CANNOT MOCK IT!!!
var db = require('./db');

module.exports.handleSignup = (email, password) => {
  // some code here...
  db.saveUser({ email, password });
  // some code here...
};
