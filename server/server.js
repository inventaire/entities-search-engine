#!/usr/bin/env node
const logger = require('../lib/logger')
const { port, inventaire } = require('config')
const setupElasticSearch = require('../lib/setup_elasticsearch')
const bodyParser = require('body-parser')
const express = require('express')
const requestsLogger = require('./middlewares/requests_logger')

setupElasticSearch()
.then(() => {
  const app = express()

  // Place the request logger first so that even requests that generate an error
  // in the middleware are logged
  app.use(requestsLogger)

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
