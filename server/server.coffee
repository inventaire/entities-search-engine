#!/usr/bin/env coffee

{ port } = require 'config'

# Use Bluebird promises instead of native ones
global.Promise = require 'bluebird'

# Force colors
require('colors').enabled = true

app = require('express')()
bodyParser = require 'body-parser'
app.use bodyParser.json()
app.use bodyParser.urlencoded({ extended: true })

app.post '/', require('./post')

app.listen port, -> console.log "server listening on port #{port}".blue
