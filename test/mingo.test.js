var Mongo = require('../lib/mingo').Mongo;

var mongo = new Mongo('mongodb://localhost');
var db = mongo.selectDb('test');
var collection = db.selectCollection('mingo_test');

var obj = { foo:'bar' };

exports.insert = function(assert) {
  collection.insert(obj, function(err, res) {
    assert.ok(res._id);
    assert.equal(res._id, obj._id);
    assert.done();
  });
};

exports.findOne = function(assert) {
  collection.findOne({ _id:obj._id }, function(err, res) {
    assert.deepEqual(obj, res);
    assert.done();
  });
};
