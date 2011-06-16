var mongodb = require('mongodb'),
    Server = mongodb.Server,
    Db = mongodb.Db,
    url = require('url');

module.exports = Mongo;

function Mongo(host) {
  var parse = url.parse(host);
  var host = parse.hostname;
  var port = parse.port || 27017;
  this.server = new Server(host, port);
}

Mongo.prototype = {
  selectDb : function (name) {
    return new MongoDb(this, name);
  }
};

function MongoDb(mongo, name) {
  this.db = new Db(name, mongo.server, { native_parser:true });
}

MongoDb.prototype = {
  open : function (cb) {
    if (this._connection) {
      cb(null, this._connection);
      return;
    }
    if (this._queue) {
      this._queue.push(cb);
      return;
    }
    this._queue = [cb];
    var that = this;
    this.db.open(function(err, db) {
      that._connection = db;
      that._queue.forEach(function(cb) {
        cb(err, db);
      });
      delete that._queue;
    });
  },
  
  selectCollection : function (name) {
    return new MongoCollection(this, name);
  }
};

function MongoCollection(db, name) {
  this.db = db;
  this.name = name;
}

MongoCollection.prototype = {
  collection : function (cb) {
    var name = this.name;
    this.db.open(function(err, db) {
      err && cb(err);
      db.collection(name, cb);
    });
  },
  
  insert : function (newobj, cb) {
    this.collection(function(err, collection) {
      err && cb(err);
      collection.insert(newobj, function(err, res) {
        err && cb(err);
        cb(null, res[0]);
      });
    });
  },
  
  findOne : function (query, cb) {
    this.collection(function(err, collection) {
      err && cb(err);
      collection.findOne(query, cb);
    });
  }
};
