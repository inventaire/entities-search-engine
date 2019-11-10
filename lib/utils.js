/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const loggers_ = require('inv-loggers');

loggers_.Error = label => (function(err) {
  loggers_.error(err, label);
  if (err.body) { loggers_.error(err.body, `${label} body`); }
});

loggers_.ErrorRethrow = label => (function(err) {
  loggers_.Error(label)(err);
  throw err;
});

module.exports = loggers_;
