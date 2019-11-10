#!/usr/bin/env node
// Use Bluebird promises instead of native ones
global.Promise = require('bluebird')
const _ = require('../lib/utils')
const { port } = require('config')
const setupElasticSearch = require('../lib/setup_elasticsearch')

const start = () => {
  const app = require('express')()
  const bodyParser = require('body-parser')
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.post('/', require('./post'))
  app.listen(port, () => _.info(`server listening on port ${port}`))
}

setupElasticSearch()
.then(start)
.catch(_.Error('init err'))
