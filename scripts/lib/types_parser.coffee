fs = require 'fs'
types = process.argv.slice 2

module.exports = (folder, extension)->
  re = new RegExp ".#{extension}$"
  availableTypes = fs.readdirSync folder
    # filter-out archives names on the pattern genres.2016-06-10T08-26.json
    .filter (filename)-> filename.split('.').length is 2
    .map (filename)-> filename.replace re, ''

  if types.length is 0
    throw new Error "missing type argument"

  if types[0] is 'all'
    types = availableTypes
  else
    types.forEach (type)->
      unless type in availableTypes
        throw new Error "missing #{extension} file for type #{type}"

  return types
