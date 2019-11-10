/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// POST { type, uris }
// => fetch entities
// => index entities in ElasticSearch wikidata or inventaire indexes,
//    depending on the URI domain

const fetchAndPutEntitiesFromUris = require('../lib/fetch_and_put_entities_from_uris');
const _ = require('../lib/utils');

module.exports = function(req, res){
  const urisPerType = req.body;

  return getTypesPromises(urisPerType)
  .then(() => res.json({ ok: true }))
  .catch(sendError(res));
};

var getTypesPromises = function(urisPerType){
  const promises = [];
  for (let type in urisPerType) {
    const uris = urisPerType[type];
    if (!(uris instanceof Array)) {
      return Promise.reject(new Error(`invalid uris array (${type})`));
    }

    if (uris.length > 0) {
      promises.push(fetchAndPutEntitiesFromUris(type, uris).catch(passNonWhitelisted));
    }
  }

  return Promise.all(promises);
};

var passNonWhitelisted = function(err){
  if (err.message === 'non whitelisted type') { return;
  } else { throw err; }
};

var sendError = res => (function(err) {
  const statusCode = err.statusCode || 500;
  const color = statusCode < 500 ? 'yellow' : 'red';
  _.log(err, 'post err', color);
  const { message, context } = err;
  return res.status(statusCode).send({ status_verbose: message, context });
});
