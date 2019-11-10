require('should')
const Promise = require('bluebird')
const { reset: resetFixtures, getById } = require('./fixtures')

describe('fixtures', () => {
  it('should create fixtures', done => {
    resetFixtures('fixtures')
    .then(() => {
      return Promise.all([
        getById('1'),
        getById('2'),
        getById('3'),
        getById('4')
      ])
    })
    .then(res => {
      res[0]._source.should.deepEqual({ text: '1' })
      res[1]._source.should.deepEqual({ text: '2' })
      res[2]._source.should.deepEqual({ text: '3' })
      res[3]._source.should.deepEqual({ text: '4' })
      done()
    })
    .catch(done)
  })
})
