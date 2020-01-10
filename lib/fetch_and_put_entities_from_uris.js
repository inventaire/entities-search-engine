const CONFIG = require('config')
const bulkPost = require('./bulk_post_to_elasticsearch')
const wdk = require('wikidata-sdk')
// omitting type, sitelinks
const props = [ 'labels', 'aliases', 'descriptions', 'claims' ]
const whitelist = CONFIG.types
const logger = require('./logger')
const formatEntities = require('./format_entities')
const unindex = require('./unindex')
const { get } = require('./request')
const { host: invHost } = CONFIG.inventaire
const { wikidata: wdIndex, inventaire: invIndex } = CONFIG.elastic.indexes

module.exports = (type, uris) => {
  logger.info(`${type} uris`, uris)

  const { wdIds, invUris } = uris.reduce(spreadIdsByDomain, { wdIds: [], invUris: [] })

  const promises = []

  if (whitelist.includes(type)) {
    if (wdIds.length > 0) {
      // generate urls for batches of 50 entities
      const wdUrls = wdk.getManyEntities({ ids: wdIds, props })
      promises.push(PutNextBatch('wd', wdIndex, type, wdUrls))
    }

    if (invUris.length > 0) {
      const invUrl = getInvEntities(invUris)
      promises.push(PutNextBatch('inv', invIndex, type, [ invUrl ]))
    }
  } else {
    // If the type isn't whitelisted make sure the associated entity wasn't
    // indexed in another type before
    if (wdIds.length > 0) promises.push(unindex(wdIndex, '_all', wdIds))
    if (invUris.length > 0) promises.push(unindex(invIndex, '_all', invUris))
  }

  return Promise.all(promises)
}

const PutNextBatch = (domain, index, type, urls) => {
  const putNextBatch = () => {
    const url = urls.shift()
    if (url == null) {
      logger.success(`done putting ${type} batches`)
      return
    }

    logger.info(`preparing next ${type} batch`, url)

    return get(url)
    .then(unindexRemovedEntities(domain, index, type))
    .then(removeMissingEntities)
    .then(formatEntities(type))
    .then(bulkPost.bind(null, type))
    // Will call itself until there is no more urls to fetch
    .then(putNextBatch)
    .catch(logger.ErrorRethrow('putNextBatch'))
  }

  return putNextBatch()
}

const unindexRemovedEntities = (domain, index, type) => async res => {
  const { entities, redirects } = await res.json()

  let urisToUnindex = []

  if (redirects != null) {
    urisToUnindex = urisToUnindex.concat(Object.keys(redirects))
  }

  if (domain === 'inv') {
    for (const uri in entities) {
      const entity = entities[uri]
      if (entity._meta_type === 'removed:placeholder') {
        urisToUnindex.push(uri)
        // Remove the entity from entities to index
        delete entities[uri]
      }
    }
  }

  await unindex(index, type, urisToUnindex)

  return entities
}

const removeMissingEntities = entities => {
  for (const id in entities) {
    const entity = entities[id]
    if (entity == null) {
      logger.warn('missing value: ignored', id)
      delete entities[id]
    }

    if (!(entity && entity.claims)) {
      // Known case: desambiguation pages given the type meta
      logger.warn('entity has no claims: ignored', id)
      delete entities[id]
    }
  }

  return entities
}

const spreadIdsByDomain = (data, uri) => {
  const [ prefix, id ] = uri.split(':')
  if (prefix === 'wd') {
    // filtering-out properties and blank nodes (type: bnode)
    if (!wdk.isItemId(id)) return data
    data.wdIds.push(id)
  } else {
    data.invUris.push(uri)
  }
  return data
}

const getInvEntities = uris => `${invHost}/api/entities?action=by-uris&uris=${uris.join('|')}`
