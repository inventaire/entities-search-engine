# POST { type, uris }
# => fetch entities
# => index entities in ElasticSearch wikidata or inventaire indexes,
#    depending on the URI domain

fetchAndPutEntitiesFromUris = require '../lib/fetch_and_put_entities_from_uris'
_ = require '../lib/utils'

module.exports = (req, res)->
  urisPerType = req.body

  getTypesPromises(urisPerType)
  .then -> res.json { ok: true }
  .catch sendError(res)

getTypesPromises = (urisPerType)->
  promises = []
  for type, uris of urisPerType
    unless uris instanceof Array
      return Promise.reject new Error("invalid uris array (#{type})")

    if uris.length > 0
      promises.push fetchAndPutEntitiesFromUris(type, uris).catch passNonWhitelisted

  return Promise.all promises

passNonWhitelisted = (err)->
  if err.message is 'non whitelisted type' then return
  else throw err

sendError = (res)-> (err)->
  statusCode = err.statusCode or 500
  color = if statusCode < 500 then 'yellow' else 'red'
  _.log err, 'post err', color
  { message, context } = err
  res.status(statusCode).send { status_verbose: message, context }
