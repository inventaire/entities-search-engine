#!/usr/bin/env coffee
[ type ] = process.argv.slice 2
split = require 'split'
require 'colors'

unless type? and /^\w+$/.test type
  throw new Error "invalid data type: #{type}"

{ removeTrailingComma, isJsonLine, logCount, error } = require './helpers'
bulkPost = require './bulk_post_to_elasticsearch'

entitiesBatch = []
onLine = (line)->
  # ignore empty line
  if line is '' then return

  line = removeTrailingComma line

  # discard invalid lines
  unless isJsonLine line
    console.log 'invalid line'.red, line
    return

  entity = JSON.parse line
  entitiesBatch.push entity
  # if entitiesBatch.length > 1000 then putBatch()
  if entitiesBatch.length > 10 then putBatch()
  logCount()

putBatch = ->
  console.log 'putting batch!'.green, entitiesBatch.length
  [ currentBatch, entitiesBatch ] = [ entitiesBatch, [] ]
  bulkPost type, currentBatch

done = ->
  # last batch
  bulkPost type, entitiesBatch
  console.log 'stream done!'.green
  # DONT EXIT THE PROCESS YET
  # as requests should still be ongoing

process.stdin
.pipe split()
.on 'data', onLine
.on 'error', error.bind(null, 'stream error')
.on 'close', done
