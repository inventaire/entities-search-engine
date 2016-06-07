fs = require 'fs'
types = process.argv.slice 2

module.exports = (folder, extension)->
  re = new RegExp ".#{extension}$"
  availableTypes = fs.readdirSync folder
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
