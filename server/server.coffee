#!/usr/bin/env coffee

app = require('express')()
# force colors
require('colors').enabled = true

bodyParser = require 'body-parser'
app.use bodyParser.json()
app.use bodyParser.urlencoded({ extended: true })

app.post '/', require('./post')

app.listen 3000, -> console.log 'server listening on port 3000'.blue
