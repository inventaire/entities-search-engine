#!/usr/bin/env coffee
[ type ] = process.argv.slice 2
split = require 'split'
require 'colors'

unless /^\w+$/.test type
  throw new Error "invalid data type: #{type}"

{ removeTrailingComma, isJsonLine, logCount, error } = require './helpers'
putToElasticSearch = require('./put_to_elasticsearch')(type)

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

process.stdin
.pipe split()
.on 'data', onLine
.on 'error', error.bind(null, 'stream error')
.on 'close', done
