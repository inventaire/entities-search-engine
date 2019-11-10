/* eslint-disable
    no-return-assign,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const breq = require('bluereq')
const _ = require('lodash')
const { host: invHost } = require('config').inventaire
const { getEntityUri, getEntityId } = require('./helpers')

// Assumes that entities in a batch are all from the same domain
const batchLengthPerDomain = {
  inv: 100,
  // Add images of Wikidata entities with small batches as each request might need a SPARQL request
  // which is rate limited to 5 request at once
  wd: 3
}

module.exports = function (entities) {
  let uris
  if (entities instanceof Array) {
    uris = entities.map(getEntityUri)
    entities = indexById(entities)
  } else {
    uris = _.values(entities).map(getEntityUri)
  }

  if (uris.length === 0) { return Promise.resolve(entities) }

  const domain = uris[0].split(':')[0]
  const batchLength = batchLengthPerDomain[domain]

  var addImageToNextEntityBatch = function () {
    const urisBatch = uris.splice(0, batchLength)

    // When there is no more URIs,
    // return the updated entities as final results
    if (urisBatch.length === 0) { return entities }

    console.log('add image to next entity batch', urisBatch)

    return breq.get(`${invHost}/api/entities?action=images&uris=${urisBatch.join('|')}`)
    .then(res => {
      const { images } = res.body

      for (const uri in images) {
        // Working around the difference between Wikidata that returns entities
        // indexed by Wikidata id and Inventaire that index by URIs
        const entityImages = images[uri]
        const id = uri.split(':')[1]
        const entity = entities[id] || entities[uri]

        // Case where we can't find the entity: it was redirected in the meantime
        if (entity != null) {
          entity.images = entityImages
        }
      }
    }).then(addImageToNextEntityBatch)
  }

  return addImageToNextEntityBatch()
}

var indexById = function (entities) {
  const index = {}
  entities.forEach(entity => {
    const id = getEntityId(entity)
    return index[id] = entity
  })
  return index
}
