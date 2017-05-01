# POST index, ids
# => fetch entities
# => PUT on ES

fetchAndPutEntitiesFromIds = require '../lib/fetch_and_put_entities_from_ids'

module.exports = (req, res)->
  { type, ids } = req.body
  fetchAndPutEntitiesFromIds type, ids
  .then -> res.json { ok: true }
  .catch sendError(res)

sendError = (res, err)->
  console.log 'err', err
  res.status(500).send err
