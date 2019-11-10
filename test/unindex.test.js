/* eslint-disable
    no-undef,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
require('should')
const { reset: resetFixtures, getById } = require('./fixtures')
const unindex = require('../lib/unindex')
const { undesiredRes, undesiredErr } = require('./utils')
const _ = require('../lib/utils')

describe('unindex', () => {
  beforeEach(resetFixtures)

  it('should unindex a doc with a type', done => {
    unindex('fixtures', 'foo', [ '1' ])
    .then(() => getById('1'))
    .then(undesiredRes(done))
    .catch(err => {
      err.body._id.should.equal('1')
      err.statusCode.should.equal(404)
      return done()
    }).catch(done)
  })

  it('should unindex a doc without a type', done => {
    unindex('fixtures', null, [ '3' ])
    .catch(undesiredErr(done))
    .then(() => getById('3'))
    .then(undesiredRes(done))
    .catch(err => {
      err.body._id.should.equal('3')
      err.statusCode.should.equal(404)
      return done()
    }).catch(done)
  })

  return it('should unindex a doc with a type _all', done => {
    unindex('fixtures', '_all', [ '1', '2' ])
    .catch(undesiredErr(done))
    .then(() => getById('2'))
    .then(undesiredRes(done))
    .catch(err => {
      err.body._id.should.equal('2')
      err.statusCode.should.equal(404)
      return done()
    }).catch(done)
  })
})
