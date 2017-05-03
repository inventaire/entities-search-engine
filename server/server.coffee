#!/usr/bin/env coffee

{ port } = require 'config'

# Use Bluebird promises instead of native ones
global.Promise = require 'bluebird'
_ = require '../lib/utils'

app = require('express')()
bodyParser = require 'body-parser'
app.use bodyParser.json()
app.use bodyParser.urlencoded({ extended: true })

app.post '/', require('./post')

app.listen port, -> _.info "server listening on port #{port}"
