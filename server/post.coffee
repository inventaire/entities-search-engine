# POST { type, ids }
# => fetch entities
# => index entities in ElasticSearch Wikidata index

fetchAndPutEntitiesFromIds = require '../lib/fetch_and_put_entities_from_ids'

module.exports = (req, res)->
  { type, ids } = req.body
  if typeof ids is 'string' then ids = ids.split '|'

  fetchAndPutEntitiesFromIds type, ids
  .then -> res.json { ok: true }
  .catch sendError(res)

sendError = (res)-> (err)->
  console.log 'final err'.red, err
  res.status(500).send err
