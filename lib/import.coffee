#!/usr/bin/env coffee
[ type ] = process.argv.slice 2
split = require 'split'
_ = require './utils'

unless type? and /^\w+$/.test type
  throw new Error "invalid data type: #{type}"

{ removeTrailingComma, isJsonLine, logCount } = require './helpers'
bulkPost = require './bulk_post_to_elasticsearch'
formatEntity = require './format_entity'

entitiesBatch = []
onLine = (line)->
  # ignore empty line
  if line is '' then return

  line = removeTrailingComma line

  # discard invalid lines
  unless isJsonLine line
    _.error line, 'invalid line'
    return

  entity = formatEntity JSON.parse(line)
  entitiesBatch.push entity
  if entitiesBatch.length > 500 then putBatch()
  logCount()

putBatch = ->
  _.success entitiesBatch.length, 'putting batch!'
  [ currentBatch, entitiesBatch ] = [ entitiesBatch, [] ]
  bulkPost type, currentBatch

done = ->
  # last batch
  bulkPost type, entitiesBatch
  _.success 'stream done!'
  # Do not exit the process yet as requests should still be ongoing

process.stdin
.pipe split()
.on 'data', onLine
.on 'error', _.Error('stream error')
.on 'close', done
