#!/usr/bin/env coffee
# Use Bluebird promises instead of native ones
global.Promise = require 'bluebird'
breq = require 'bluereq'
_ = require '../lib/utils'
{ port } = require 'config'
setupElasticSearch = require '../lib/setup_elasticsearch'

start = ->
  app = require('express')()
  bodyParser = require 'body-parser'
  app.use bodyParser.json()
  app.use bodyParser.urlencoded({ extended: true })
  app.post '/', require('./post')
  app.listen port, -> _.info "server listening on port #{port}"

setupElasticSearch()
.then start
.catch _.Error('init err')
