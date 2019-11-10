/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { host:elasticHost } = require('config').elastic;
const breq = require('bluereq');
const _ = require('./utils');

module.exports = function(index, ids){
  // See https://www.elastic.co/guide/en/elasticsearch/reference/2.1/docs-multi-get.html
  if (typeof index !== 'string') {
    throw new Error(`invalid index: ${index}`);
  }

  if (!(ids instanceof Array)) {
    throw new Error(`invalid ids: ${ids}`);
  }

  return breq.post(`${elasticHost}/${index}/_mget?_source=false`, { ids })
  .then(res => res.body.docs
  .reduce(aggregateIdsByType, {}));
};

var aggregateIdsByType = function(index, doc){
  if (!doc.found) { return index; }
  const { _type, _id } = doc;
  if (!index[_type]) { index[_type] = []; }
  index[_type].push(_id);
  return index;
};
