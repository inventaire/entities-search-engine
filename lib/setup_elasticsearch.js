const breq = require('bluereq')
const _ = require('./utils')
const CONFIG = require('config')
const { host: elasticHost, indexes } = CONFIG.elastic
if (!indexes.inventaire) throw new Error('Missing config indexes.inventaire')
const invIndexUri = `${elasticHost}/${indexes.inventaire}`

const setupElasticSearch = () => {
  return breq.get(elasticHost)
  .then(ensureElasticInvIndex)
  .catch(waitForElastic)
}

const ensureElasticInvIndex = () => {
  return breq.get(invIndexUri)
  .tap(() => { _.info(`${invIndexUri} already exists`) })
  .catch(err => {
    if (err.statusCode === 404) return createIndex(invIndexUri)
    else throw err
  })
}

const createIndex = uri => {
  _.info(`creating ${uri}`)
  return breq.put(uri)
  .catch(err => {
    _.error(err, `failed to create ${invIndexUri}`)
    throw err
  })
}

const waitForElastic = err => {
  if (!err.message.includes('ECONNREFUSED')) throw err
  _.warn(`waiting for ElasticSearch on ${elasticHost}`)
  return Promise.resolve()
  .delay(500)
  .then(setupElasticSearch)
}

module.exports = setupElasticSearch
