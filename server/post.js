// POST { type, uris }
// => fetch entities
// => index entities in ElasticSearch wikidata or inventaire indexes,
//    depending on the URI domain

const fetchAndPutEntitiesFromUris = require('../lib/fetch_and_put_entities_from_uris')
const logger = require('../lib/logger')

module.exports = (req, res) => {
  const urisPerType = req.body
  console.log('urisPerType', urisPerType)

  return getTypesPromises(urisPerType)
  .then(() => res.json({ ok: true }))
  .catch(sendError(res))
}

const getTypesPromises = urisPerType => {
  const promises = []
  for (const type in urisPerType) {
    const uris = urisPerType[type]
    if (!(uris instanceof Array)) {
      return Promise.reject(new Error(`invalid uris array (${type})`))
    }

    if (uris.length > 0) {
      promises.push(fetchAndPutEntitiesFromUris(type, uris).catch(passNonWhitelisted))
    }
  }

  return Promise.all(promises)
}

const passNonWhitelisted = err => {
  if (err.message !== 'non whitelisted type') throw err
}

const sendError = res => err => {
  const statusCode = err.statusCode || 500
  if (statusCode >= 500) logger.error('post err', err)
  else logger.warn('post err', err)
  const { message, context } = err
  res.status(statusCode).send({ status_verbose: message, context })
}
