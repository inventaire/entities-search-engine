loggers_ = require 'inv-loggers'

loggers_.Error = (label)-> (err)->
  loggers_.error err, label
  if err.body then loggers_.error err.body, "#{label} body"
  return

loggers_.ErrorRethrow = (label)-> (err)->
  loggers_.Error(label)(err)
  throw err

module.exports = loggers_
