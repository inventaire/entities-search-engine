/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
require('should');
const { reset: resetFixtures } = require('./fixtures');
const getIdsByTypes = require('../lib/get_ids_by_types');

describe('get ids by types', () => it('should return ids indexed by types', function(done){
  resetFixtures()
  .then(() => getIdsByTypes('fixtures', [ '1', '2', '3', '4' ]))
  .then(function(res){
    res.foo.should.be.an.Array();
    res.foo.length.should.equal(4);
    return done();}).catch(done);

}));
