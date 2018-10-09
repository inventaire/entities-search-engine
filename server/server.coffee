#!/usr/bin/env coffee

{ port } = require 'config'

# Use Bluebird promises instead of native ones
global.Promise = require 'bluebird'
_ = require '../lib/utils'
CONFIG = require 'config'
breq = require 'bluereq'
{ host:elasticHost, indexes } = CONFIG.elastic

unless indexes.inventaire
  throw new Error "Missing config indexes.inventaire"

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
  invIndexUri = "#{elasticHost}/#{indexes.inventaire}"
  breq.get invIndexUri
  .catch (err)->
    unless err.statusMessage.includes 'Not Found'
      throw err
    createIndex(invIndexUri)

createIndex = (uri) ->
  breq.put uri
  .catch (err)->
    throw new Error "Failed to create #{elasticHost}/#{indexes.inventaire}"

waitForElastic = (err) ->
  unless err.message.includes 'ECONNREFUSED'
    throw err
  Promise.resolve()
  .delay 500
  .then setupElastic

setupElastic()
.then start
