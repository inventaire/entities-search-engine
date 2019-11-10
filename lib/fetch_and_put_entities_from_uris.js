CONFIG = require 'config'
bulkPost = require './bulk_post_to_elasticsearch'
wdk = require 'wikidata-sdk'
# omitting type, sitelinks
props = [ 'labels', 'aliases', 'descriptions', 'claims' ]
whitelist = CONFIG.types
_ = require './utils'
formatEntities = require './format_entities'
unindex = require './unindex'
breq = require 'bluereq'
{ host:invHost } = CONFIG.inventaire
{ wikidata:wdIndex, inventaire:invIndex } = CONFIG.elastic.indexes

module.exports = (type, uris)->
  _.log uris, "#{type} uris"

  { wdIds, invUris } = uris.reduce spreadIdsByDomain, { wdIds: [], invUris: [] }

  promises = []

  if type in whitelist
    if wdIds.length > 0
      # generate urls for batches of 50 entities
      wdUrls = wdk.getManyEntities { ids: wdIds, props }
      promises.push PutNextBatch('wd', wdIndex, type, wdUrls)()

    if invUris.length > 0
      invUrl = getInvEntities invUris
      promises.push PutNextBatch('inv', invIndex, type, [ invUrl ])()
  else
    # If the type isn't whitelisted make sure the associated entity wasn't
    # indexed in another type before
    if wdIds.length > 0 then promises.push unindex(wdIndex, '_all', wdIds)
    if invUris.length > 0 then promises.push unindex(invIndex, '_all', invUris)

  return Promise.all promises

PutNextBatch = (domain, index, type, urls)->
  return putNextBatch = ->
    url = urls.shift()
    unless url?
      _.success "done putting #{type} batches"
      return

    _.info url, "preparing next #{type} batch"

    breq.get url
    .then unindexRemovedEntities(domain, index, type)
    .then removeMissingEntities
    .then formatEntities(type)
    .then bulkPost.bind(null, type)
    # Will call itself until there is no more urls to fetch
    .then putNextBatch
    .catch _.ErrorRethrow('putNextBatch')

unindexRemovedEntities = (domain, index, type)-> (res)->
  { entities, redirects } = res.body

  urisToUnindex = []

  if redirects?
    urisToUnindex = urisToUnindex.concat Object.keys(redirects)

  if domain is 'inv'
    for uri, entity of entities
      if entity._meta_type is 'removed:placeholder'
        urisToUnindex.push uri
        # Remove the entity from entities to index
        delete entities[uri]

  unindex index, type, urisToUnindex

  return entities

removeMissingEntities = (entities)->
  for id, entity of entities
    unless entity?
      _.warn id, 'missing value: ignored'
      delete entities[id]

    unless entity?.claims?
      # Known case: desambiguation pages given the type meta
      _.warn id, 'entity has no claims: ignored'
      delete entities[id]

  return entities

spreadIdsByDomain = (data, uri)->
  [ prefix, id ] = uri.split ':'
  if prefix is 'wd'
    # filtering-out properties and blank nodes (type: bnode)
    unless wdk.isItemId then return data
    data.wdIds.push id
  else
    data.invUris.push uri
  return data

getInvEntities = (uris)->
  "#{invHost}/api/entities?action=by-uris&uris=#{uris.join('|')}"
