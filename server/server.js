#!/usr/bin/env node
// Use Bluebird promises instead of native ones
global.Promise = require('bluebird')
const _ = require('../lib/utils')
const { port } = require('config')
const setupElasticSearch = require('../lib/setup_elasticsearch')
const bodyParser = require('body-parser')
const express = require('express')

setupElasticSearch()
.then(() => {
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.get('/', (req, res) => res.json({ hello: true }))
  app.post('/', require('./post'))

  app.listen(port, () => _.info(`server listening on port ${port}`))
})
.catch(_.Error('init err'))
