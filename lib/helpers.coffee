counter = 0

module.exports =
  removeTrailingComma: (line)-> line.replace /,$/, ''

  isJsonLine: (line)-> line[0] is '{' and line.slice(-1)[0] is '}'

  logCount: ->
    counter++
    # only log once every 100 calls to avoid slowing the process
    # by just logging things
    if counter % 100 is 0 then console.log counter
