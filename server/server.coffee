#!/usr/bin/env coffee

{ port } = require 'config'

# Use Bluebird promises instead of native ones
global.Promise = require 'bluebird'
_ = require '../lib/utils'
CONFIG = require 'config'
breq = require 'bluereq'
{ host:elasticHost, indexes } = CONFIG.elastic

ensureElasticIndex = ->
  breq.get elasticHost
  .then createIndex
  .catch waitForElastic

createIndex = ->
  unless indexes.inventaire
    return console.log "no inventaire indexes"

  breq.get "#{elasticHost}/#{indexes.inventaire}"
  .catch (err)->
    breq.put "#{elasticHost}/#{indexes.inventaire}"
    .catch (err)->
      _.error err "invalid elastic index name"

waitForElastic = (err) ->
  unless err.message.includes 'ECONNREFUSED' then throw err

  Promise.resolve()
  .delay 1000
  .then ensureElasticIndex

start = ->
  app = require('express')()
  bodyParser = require 'body-parser'
  app.use bodyParser.json()
  app.use bodyParser.urlencoded({ extended: true })

  app.post '/', require('./post')

  app.listen port, -> _.info "server listening on port #{port}"

ensureElasticIndex()
.then start
