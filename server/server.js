#!/usr/bin/env node
/* eslint-disable
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Use Bluebird promises instead of native ones
global.Promise = require('bluebird')
const breq = require('bluereq')
const _ = require('../lib/utils')
const { port } = require('config')
const setupElasticSearch = require('../lib/setup_elasticsearch')

const start = function () {
  const app = require('express')()
  const bodyParser = require('body-parser')
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.post('/', require('./post'))
  return app.listen(port, () => _.info(`server listening on port ${port}`))
}

setupElasticSearch()
.then(start)
.catch(_.Error('init err'))
