# POST index, ids
# => fetch entities
# => PUT on ES

wdk = require 'wikidata-sdk'
request = require 'request'
values = require 'lodash.values'
compact = require 'lodash.compact'

PutToElasticSearch = require '../lib/put_to_elasticsearch'
CONFIG = require 'config'

module.exports = (req, res)->
  { type, ids } = req.body
  console.log 'type'.cyan, type
  console.log 'ids'.cyan, ids[0..10], '[...]'.grey

  unless type in CONFIG.types
    res.status(400).send { unknown_type: type }
    return


  # filtering-out properties and blank nodes (type: bnode)
  ids = ids.filter (id)-> wdk.isWikidataEntityId id

  if typeof ids is 'string' then ids = ids.split '|'

  # generate urls for batches of 50 entities
  urls = wdk.getManyEntities
    ids: ids
    # omitting type, claims, sitelinks
    props: ['labels', 'aliases', 'descriptions']

  putToES = PutToElasticSearch type

  # make the requests and put the result on ElasticSearch
  GetData(res, putToES, urls)()


GetData = (res, putToES, urls)->
  return getData = ->
    url = urls.shift()
    if url?
      console.log 'get data'.green, url
      request.get url, (err, resp)->
        if err then return sendError res, err
        else
          { entities } = JSON.parse resp.body

          # logging possible empty values that will be filtered-out by 'compact'
          for k, v of entities
            unless v? then console.warn 'missing value: ignored', k

          entities = compact values(entities)
          # Yeah, nested recusrive functions!
          PutEntity(res, getData, putToES, entities)()
    else
      res.json { ok: true }

PutEntity = (res, getData, putToES, entities)->
  # recursively consuming the passed entities
  return putEntity = (err, resp)->
    if err then return sendError res, err
    else
      entity = entities.shift()
      if entity then putToES entity, false, putEntity
      # call the next batch
      else getData()

sendError = (res, err)->
  console.log 'err', err
  res.status(500).send err
