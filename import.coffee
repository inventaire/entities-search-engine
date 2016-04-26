#!/usr/bin/env coffee

[ type, filePath ] = process.argv.slice 2
fs = require 'fs'
split = require 'split'
require 'colors'

unless /^\w+$/.test type
  throw new Error "invalid data type: #{type}"

# will throw if the file doesn't exist
fs.statSync filePath

{ removeTrailingComma, isJsonLine, logCount, error } = require './lib/helpers'
putToElasticSearch = require('./lib/put_to_elasticsearch')(type)

onLine = (line)->
  # ignore empty line
  if line is '' then return

  line = removeTrailingComma line

  # discard invalid lines
  unless isJsonLine line
    console.log 'invalid line'.red, line
    return

  putToElasticSearch line
  logCount()

done = ->
  console.log 'stream done!'.green
  # DONT EXIT THE PROCESS YET
  # as requests should still be ongoing

fs.createReadStream filePath
.pipe split()
.on 'data', onLine
.on 'error', error.bind(null, 'stream error')
.on 'close', done
