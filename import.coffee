#!/usr/bin/env coffee

[ filePath ] = process.argv.slice 2

fs = require 'fs'
split = require 'split'
require 'colors'

{ removeTrailingComma, isJsonLine, logCount, error } = require './lib/helpers'
putToElasticSearch = require './lib/put_to_elasticsearch'

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
  # as requests might still be ongoing

fs.createReadStream filePath
.pipe split()
.on 'data', onLine
.on 'error', error.bind(null, 'stream error')
.on 'close', done
