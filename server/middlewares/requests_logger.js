// Adapted from https://github.com/expressjs/morgan 1.1.1
module.exports = (req, res, next) => {
  req._startAt = process.hrtime()

  res.on('close', () => {
    const line = format(req, res)
    if (line == null) return
    process.stdout.write(`${line}\n`)
  })

  next()
}

const format = (req, res) => {
  const { method, originalUrl: url, user } = req
  const { statusCode: status, finished } = res

  const color = statusCategoryColor[status.toString()[0]] || noColor

  // res.finished is set to true once the 'finished' event was fired
  // See https://nodejs.org/api/http.html#http_event_finish
  // Interruption typically happen when the client closes the request,
  // for instance when tests timeout
  const interrupted = finished ? '' : ' \x1b[33mCLOSED BEFORE FINISHING'

  const base = `\x1b[90m${method} ${url} \x1b[${color}m${status}${interrupted} \x1b[90m${responseTime(req, res)}`

  if (user) {
    return `${base} - u:${user._id}\x1b[0m`
  } else {
    return `${base}\x1b[0m`
  }
}

const statusCategoryColor = {
  5: 31, // red
  4: 33, // yellow
  3: 36, // cyan
  2: 32 // green
}

const noColor = 0

const responseTime = (req, res) => {
  if (req._startAt == null) return ''
  const [ seconds, nanoseconds ] = process.hrtime(req._startAt)
  const ms = (seconds * 1000) + (nanoseconds / 1000000)
  return `${ms.toFixed(3)}ms`
}
