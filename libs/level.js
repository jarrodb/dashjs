/*
 * leveldb connection
 */

var level = require('levelup');

var Model = function(schema, properties) {
  _Model = function(data) {
    for (var field in schema)
      this[field] = (data)
        ? data[field]
        : schema[field].default
        || schema[field].type();
  };
  _Model.prototype = {
    db: leveldb.db,
    schema: schema,
    save: function(cb) {
      try {
        this._validate();
      } catch(e) {
        return cb(e);
      }
      this.db.put(this.key+'~'+this[this.key], JSON.stringify(this), cb);
    },
    find: function(name, cb) {
      this.db.get(this.key+'~'+name, function(err, doc) {
        if (err) cb(err, null);
        cb(null, new _Model(JSON.parse(doc)));
      });
    },
    remove: function(cb) {
      if (! this[this.key])
        cb(new Error("model must be populated"));
      this.db.del(this.key+'~'+this[this.key], cb);
    },
    _validate: function() {
      if (! this.key || ! this[this.key])
        throw new Error('key cannot be empty');
      for (var k in this.schema) {
        if (! this[k] && this.schema[k].required)
          throw new Error(k+' is a required field');
      }
      if (this.validate)
        this.validate();
    },
    _index: function() {
      for (var k in this.schema) {
        if (this.schema[k].index)
          return k;
      }
    }
  }

  for (var prop in properties)
    _Model.prototype[prop] = properties[prop];

  return _Model;
}

var leveldb = {
  db: null,
  connect: function(db_name) {
    this.db = level('./'+db_name);
  },
  models : {},
  model : function(name, obj) {
    if (typeof obj === 'undefined')
      return this.models[name];
    obj.db = this.db;
    this.models[name] = obj;
  },
  Model: Model
}

module.exports = leveldb;

