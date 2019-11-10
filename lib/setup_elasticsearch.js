breq = require 'bluereq'
_ = require './utils'
CONFIG = require 'config'
{ host:elasticHost, indexes } = CONFIG.elastic
unless indexes.inventaire then throw new Error "Missing config indexes.inventaire"
invIndexUri = "#{elasticHost}/#{indexes.inventaire}"

setupElasticSearch = ->
  breq.get elasticHost
  .then ensureElasticInvIndex
  .catch waitForElastic

ensureElasticInvIndex = ->
  breq.get invIndexUri
  .catch (err)->
    if err.statusCode is 404 then return createIndex invIndexUri
    else throw err

createIndex = (uri) ->
  _.info "creating #{uri}"
  breq.put uri
  .catch (err)->
    _.error err, "failed to create #{invIndexUri}"
    throw err

waitForElastic = (err) ->
  unless err.message.includes 'ECONNREFUSED' then throw err
  _.warn "waiting for ElasticSearch on #{elasticHost}"
  Promise.resolve()
  .delay 500
  .then setupElasticSearch

module.exports = setupElasticSearch
