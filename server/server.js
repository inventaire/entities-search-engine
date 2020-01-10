#!/usr/bin/env node
const logger = require('../lib/logger')
const { port, inventaire } = require('config')
const setupElasticSearch = require('../lib/setup_elasticsearch')
const bodyParser = require('body-parser')
const express = require('express')

setupElasticSearch()
.then(() => {
  const app = express()

  // Always consider that the input is JSON, whatever the request headers say
  app.use(bodyParser.json({ type: '*/*'}))

  app.get('/', (req, res) => res.json({ hello: true }))
  app.post('/', require('./post'))

  app.listen(port, () => {
    logger.info(`server listening on port ${port}`)
    logger.info(`fetching data from ${inventaire.host}`)
  })
})
.catch(logger.Error('init err'))
