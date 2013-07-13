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
    _validate: function() {
      if (! this.key || ! this[this.key])
        throw new Error('key cannot be empty');
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

