#!/usr/bin/env coffee
# Use Bluebird promises instead of native ones
global.Promise = require 'bluebird'
breq = require 'bluereq'
_ = require '../lib/utils'
CONFIG = require 'config'
{ port } = CONFIG
{ host:elasticHost, indexes } = CONFIG.elastic
unless indexes.inventaire then throw new Error "Missing config indexes.inventaire"
invIndexUri = "#{elasticHost}/#{indexes.inventaire}"

setupElastic = ->
  breq.get elasticHost
  .then ensureElasticInvIndex
  .catch waitForElastic

start = ->
  app = require('express')()
  bodyParser = require 'body-parser'
  app.use bodyParser.json()
  app.use bodyParser.urlencoded({ extended: true })
  app.post '/', require('./post')
  app.listen port, -> _.info "server listening on port #{port}"

ensureElasticInvIndex = ->
  breq.get invIndexUri
  .catch (err)->
    if err.statusCode is 404 then return createIndex invIndexUri
    else throw err

createIndex = (uri) ->
  _.info "creating #{uri}"
  breq.put uri
  .catch (err)->
    _.error err, "failed to create #{invIndexUri}"
    throw err

waitForElastic = (err) ->
  unless err.message.includes 'ECONNREFUSED' then throw err
  _.warn "waiting for ElasticSearch on #{elasticHost}"
  Promise.resolve()
  .delay 500
  .then setupElastic

setupElastic()
.then start
.catch _.Error('init err')
