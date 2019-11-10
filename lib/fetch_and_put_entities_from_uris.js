/* eslint-disable
    no-return-assign,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CONFIG = require('config')
const bulkPost = require('./bulk_post_to_elasticsearch')
const wdk = require('wikidata-sdk')
// omitting type, sitelinks
const props = [ 'labels', 'aliases', 'descriptions', 'claims' ]
const whitelist = CONFIG.types
const _ = require('./utils')
const formatEntities = require('./format_entities')
const unindex = require('./unindex')
const breq = require('bluereq')
const { host: invHost } = CONFIG.inventaire
const { wikidata: wdIndex, inventaire: invIndex } = CONFIG.elastic.indexes

module.exports = function (type, uris) {
  _.log(uris, `${type} uris`)

  const { wdIds, invUris } = uris.reduce(spreadIdsByDomain, { wdIds: [], invUris: [] })

  const promises = []

  if (whitelist.includes(type)) {
    if (wdIds.length > 0) {
      // generate urls for batches of 50 entities
      const wdUrls = wdk.getManyEntities({ ids: wdIds, props })
      promises.push(PutNextBatch('wd', wdIndex, type, wdUrls)())
    }

    if (invUris.length > 0) {
      const invUrl = getInvEntities(invUris)
      promises.push(PutNextBatch('inv', invIndex, type, [ invUrl ])())
    }
  } else {
    // If the type isn't whitelisted make sure the associated entity wasn't
    // indexed in another type before
    if (wdIds.length > 0) { promises.push(unindex(wdIndex, '_all', wdIds)) }
    if (invUris.length > 0) { promises.push(unindex(invIndex, '_all', invUris)) }
  }

  return Promise.all(promises)
}

var PutNextBatch = function (domain, index, type, urls) {
  let putNextBatch
  return putNextBatch = function () {
    const url = urls.shift()
    if (url == null) {
      _.success(`done putting ${type} batches`)
      return
    }

    _.info(url, `preparing next ${type} batch`)

    return breq.get(url)
    .then(unindexRemovedEntities(domain, index, type))
    .then(removeMissingEntities)
    .then(formatEntities(type))
    .then(bulkPost.bind(null, type))
    // Will call itself until there is no more urls to fetch
    .then(putNextBatch)
    .catch(_.ErrorRethrow('putNextBatch'))
  }
}

var unindexRemovedEntities = (domain, index, type) => function (res) {
  const { entities, redirects } = res.body

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

  unindex(index, type, urisToUnindex)

  return entities
}

var removeMissingEntities = function (entities) {
  for (const id in entities) {
    const entity = entities[id]
    if (entity == null) {
      _.warn(id, 'missing value: ignored')
      delete entities[id]
    }

    if ((entity != null ? entity.claims : undefined) == null) {
      // Known case: desambiguation pages given the type meta
      _.warn(id, 'entity has no claims: ignored')
      delete entities[id]
    }
  }

  return entities
}

var spreadIdsByDomain = function (data, uri) {
  const [ prefix, id ] = Array.from(uri.split(':'))
  if (prefix === 'wd') {
    // filtering-out properties and blank nodes (type: bnode)
    if (!wdk.isItemId) { return data }
    data.wdIds.push(id)
  } else {
    data.invUris.push(uri)
  }
  return data
}

var getInvEntities = uris => `${invHost}/api/entities?action=by-uris&uris=${uris.join('|')}`
