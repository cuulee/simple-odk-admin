var test = require('tape')
var fs = require('fs')

var parseXform = require('../../src/utils/parse-xform')

const testXform = fs.readFileSync(__dirname + '/fixtures/birds.xml').toString()

test('Creates expected meta', function (t) {
  var expectedMeta = require('./fixtures/birds.json')
  expectedMeta.xml = testXform

  parseXform(testXform, function (err, result) {
    t.error(err, 'Does not produce error')
    t.deepEqual(result, expectedMeta, 'Matches expected output')
    t.end()
  })
})
