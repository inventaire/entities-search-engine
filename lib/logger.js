require('util').inspect.defaultOptions.depth = 10
const chalk = require('tiny-chalk')
const separator = chalk.grey('-------')

const log = (color, write) => (text, obj) => {
  const coloredText = chalk[color](text)
  if (obj) {
    if (typeof obj === 'string') {
      write(coloredText, obj)
    } else {
      write(`${separator} ${coloredText} ${separator}`)
      write(obj)
      write(`${separator}${separator}`)
    }
  } else {
    write(coloredText)
  }
}

const baseLoggers = {
  info: log('blue', console.log),
  success: log('green', console.log),
  warn: log('yellow', console.error),
  error: log('red', console.error)
}

const promiseChainLoggers = {
  Info: label => obj => {
    baseLoggers.info(label, obj)
    return obj
  },

  Error: label => err => {
    baseLoggers.error(label, err)
  },

  ErrorRethrow: label => err => {
    baseLoggers.error(label, err)
    throw err
  },
}

module.exports = Object.assign(baseLoggers, promiseChainLoggers)
