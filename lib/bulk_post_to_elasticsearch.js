/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CONFIG = require('config');
const bulk = require('./bulk');
const buildLine = bulk.buildLine.bind(null, 'index');
const _ = require('./utils');
const { wikidata:wdIndex, inventaire:invIndex } = CONFIG.elastic.indexes;
const { getEntityDomain } = require('./helpers');

const indexPerDomain = {
  wd: wdIndex,
  inv: invIndex
};

module.exports = function(type, entities){
  if (entities.length === 0) { return Promise.resolve(); }

  const batch = [];
  entities.forEach(appendEntity(type, batch));

  return bulk.postBatch(batch)
  .then(bulk.logRes('bulk post res'))
  .catch(_.Error('bulk post err'));
};

// see: https://www.elastic.co/guide/en/elasticsearch/guide/current/bulk.html
var appendEntity = (type, batch) => (function(entity) {
  const domain = getEntityDomain(entity);
  // Guessing the index that late allows to not assume the index from the source
  // as Wikidata entities might be coming from the Inventaire API
  // Known case: Inventaire entities redirecting to Wikidata entities
  const index = indexPerDomain[domain];
  batch.push(buildLine(index, type, entity.id));
  return batch.push(JSON.stringify(entity));
});
