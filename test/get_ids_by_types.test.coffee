require 'should'
{ reset: resetFixtures } = require './fixtures'
getIdsByTypes = require '../lib/get_ids_by_types'

describe 'get ids by types', ->
  it 'should return ids indexed by types', (done)->
    resetFixtures()
    .then -> getIdsByTypes 'fixtures', [ '1', '2', '3', '4' ]
    .then (res)->
      res.foo.should.be.an.Array()
      res.foo.length.should.equal 4
      done()
    .catch done

    return
