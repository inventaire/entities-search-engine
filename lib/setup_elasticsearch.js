const { get, put } = require('./request')
const logger = require('./logger')
const { wait } = require('./utils')
const CONFIG = require('config')
const { host: elasticHost, indexes } = CONFIG.elastic
if (!indexes.inventaire) throw new Error('Missing config indexes.inventaire')
const invIndexUri = `${elasticHost}/${indexes.inventaire}`

const setupElasticSearch = () => {
  return get(elasticHost)
  .then(ensureElasticInvIndex)
  .catch(waitForElastic)
}

const ensureElasticInvIndex = () => {
  return get(invIndexUri)
  .then(() => { logger.info(`${invIndexUri} already exists`) })
  .catch(err => {
    if (err.statusCode === 404) return createIndex(invIndexUri)
    else throw err
  })
}

const createIndex = uri => {
  logger.info(`creating ${uri}`)
  return put({ url: uri })
  .catch(err => {
    logger.error(`failed to create ${invIndexUri}`, err)
    throw err
  })
}

const waitForElastic = err => {
  if (!err.message.includes('ECONNREFUSED')) throw err
  logger.warn(`waiting for ElasticSearch on ${elasticHost}`)
  return wait(500).then(setupElasticSearch)
}

module.exports = setupElasticSearch
