/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
require('should');
const Promise = require('bluebird');
const { reset: resetFixtures, getById } = require('./fixtures');
const getIdsByTypes = require('../lib/get_ids_by_types');
const _ = require('../lib/utils');

describe('fixtures', () => it('should create fixtures', function(done){
  resetFixtures('fixtures')
  .then(() => Promise.all([
    getById('1'),
    getById('2'),
    getById('3'),
    getById('4')
  ]))
  .then(function(res){
    res[0]._source.should.deepEqual({ text: '1' });
    res[1]._source.should.deepEqual({ text: '2' });
    res[2]._source.should.deepEqual({ text: '3' });
    res[3]._source.should.deepEqual({ text: '4' });
    return done();}).catch(done);

}));
