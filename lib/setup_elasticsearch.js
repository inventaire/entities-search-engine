/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const breq = require('bluereq');
const _ = require('./utils');
const CONFIG = require('config');
const { host:elasticHost, indexes } = CONFIG.elastic;
if (!indexes.inventaire) { throw new Error("Missing config indexes.inventaire"); }
const invIndexUri = `${elasticHost}/${indexes.inventaire}`;

const setupElasticSearch = () => breq.get(elasticHost)
.then(ensureElasticInvIndex)
.catch(waitForElastic);

var ensureElasticInvIndex = () => breq.get(invIndexUri)
.catch(function(err){
  if (err.statusCode === 404) { return createIndex(invIndexUri);
  } else { throw err; }
});

var createIndex = function(uri) {
  _.info(`creating ${uri}`);
  return breq.put(uri)
  .catch(function(err){
    _.error(err, `failed to create ${invIndexUri}`);
    throw err;
  });
};

var waitForElastic = function(err) {
  if (!err.message.includes('ECONNREFUSED')) { throw err; }
  _.warn(`waiting for ElasticSearch on ${elasticHost}`);
  return Promise.resolve()
  .delay(500)
  .then(setupElasticSearch);
};

module.exports = setupElasticSearch;
