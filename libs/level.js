/*
 * leveldb connection
 */

var level = require('levelup');

var Model = function(schema, properties) {
  var _Model = function(data) {
    for (var field in schema) {
      if (data && data.hasOwnProperty(field)) this[field] = data[field];
      else {
        var field_default = schema[field].default;
        if (field_default && typeof field_default === 'function') {
            this[field] = field_default();
        } else {
            this[field] = field_default;
        }
      }
    }
  };
  _Model.prototype = {
    db: leveldb.db,
    schema: schema,
    _recKey: function(key) {
      if (typeof key === 'undefined') key = this[this._key];
      return this._name + '~' + key;
    },
    save: function(cb) {
      try {
        this._validate();
      } catch(e) {
        return cb(e);
      }
      var key = this._recKey();
      this.db.put(key, JSON.stringify(this), cb);
    },
    find: function(key, cb) {
      this.db.get(this._recKey(key), function(err, doc) {
        if (err) return cb(err, null);
        if (typeof doc === 'undefined') return cb(null, null);
        return cb(null, new _Model(JSON.parse(doc)));
      });
    },
    remove: function(cb) {
      if (! this[this._key])
        cb(new Error("model must be populated"));
      this.db.del(this._recKey(), cb);
    },
    _validate: function() {
      if (! this._key || ! this[this._key])
        throw new Error('_key cannot be empty');
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
    obj.prototype._name = name.toLowerCase(); // use the model name to
                                              // construct the key
    obj.db = this.db;
    this.models[name] = obj;
  },
  Model: Model
}

module.exports = leveldb;

