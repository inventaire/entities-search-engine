const loggers_ = require('inv-loggers')

loggers_.Error = label => err => {
  loggers_.error(err, label)
  if (err.body) loggers_.error(err.body, `${label} body`)
}

loggers_.ErrorRethrow = label => err => {
  loggers_.Error(label)(err)
  throw err
}

module.exports = loggers_
