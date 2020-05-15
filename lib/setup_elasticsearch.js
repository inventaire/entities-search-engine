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

const waitForElastic = async err => {
  if (err.statusCode === 503 || err.message.includes('ECONNREFUSED')) {
    logger.warn(`waiting for ElasticSearch on ${elasticHost}`)
    await wait(500)
    return setupElasticSearch
  } else {
    throw err
  }
}

module.exports = setupElasticSearch
