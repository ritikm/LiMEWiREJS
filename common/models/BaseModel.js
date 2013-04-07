function Model (collection) {
  var Model = function (collection) {
    this.collection = collection;
    this.name = collection._name;
  }

  Model.prototype = _.clone(collection);
  Model.prototype.constructor = Model;

  Model.prototype.getCollection = function () {
    return this.collection;
  }

  Model.prototype.count = function (query) {
    return this.collection.find(query).count();
  }

  Model.prototype.findAll = function (query) {
    return this.collection.find(query).fetch();
  }

  Model.prototype.findOne = function (query) {
    return this.collection.findOne(query)
  }

  Model.prototype.create = function (data, callback) {
    data.timestamp = Date.now();

    if (!callback) {
      return this.collection.insert(data);
    } else {
      return this.collection.insert(data, callback);
    }
  }

  Model.prototype.update = function (query, update, options, callback) {
    if (typeof options === 'function') {
      callback = options;
    }

    if (!callback) {
      return this.collection.update(query, update, options);
    } else {
      return this.collection.update(query, update, options, callback);
    }
  }

  Model.prototype.set = function (query, updatedData, callback) {
    return this.update(query, { $set: updatedData }, callback);
  }

  Model.prototype.setAll = function (query, updatedData, callback) {
    return this.update(query, { $set: updatedData }, { multi: true }, callback);
  }

  Model.prototype.unset = function (query, field, callback) {
    var unsetQuery = {};
    unsetQuery[field] = 1;

    return this.update(query, { $unset: unsetQuery }, callback);
  }

  Model.prototype.get = function (query, key) {
    var value = this.findOne(query);

    // handle dot notation (key = 'key1.key2' => doc[key1][key2])
    if (key.indexOf(".") > 0) {
      var keys = key.split(".");
      for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i];
        if (value[key]) {
          value = value[key];
        } else {
          return undefined;
        }
      }
      return value;
    } else {
      if (value[key]) {
        return value[key];
      } else {
        return undefined;
      }
    }
  }

  if (Meteor.isServer) {
    Model.prototype.getAll = function (query, key, callback) {
      var outputKeys = {};
      outputKeys[key] = 1;
      return this.collection.find(query, { fields: outputKeys }).fetch();
    }
  }

  Model.prototype.destroy = function (query, callback) {
    if (!callback) {
      return this.collection.remove(query);
    } else {
      return this.collection.remove(query, callback);
    }
  }

  Model.prototype.push = function (query, field, value, callback) {
    var pushQuery = {};
    pushQuery[field] = value;

    if (isArray(value)) {
      // use $pushAll
      return this.update(query, { $pushAll: pushQuery }, callback);
    } else {
      // use regular $push
      return this.update(query, { $push: pushQuery }, callback);
    }
  }

  Model.prototype.pull = function (query, field, value, callback) {
    var pushQuery = {};
    pushQuery[field] = value;

    if (isArray(value)) {
      // use $pushAll
      return this.update(query, { $pullAll: pushQuery }, callback);
    } else {
      // use regular $push
      return this.update(query, { $pull: pushQuery }, callback);
    }
  }

  return new Model(collection);

  // Model.prototype.increment = function (query, key, amount, callback) {
  //   var incrementQuery = {};
  //   incrementQuery[key] = parseFloat(amount);
  //   this.collection.findAndModify(query, {}, { "$inc": incrementQuery }, { new: true }, function (err, doc) {
  //     if (err) throw err;
  //     if (callback) {
  //       callback(doc);
  //     }
  //   });
  // }

  // Model.prototype.findAllSorted = function (query, sortQuery, limit, callback) {
  //   if (typeof(limit) != "number") {
  //     callback = limit;
  //     limit = null;
  //   }

  //   var results = this.collection.find(query);

  //   if (limit) {
  //     results = results.limit(limit);
  //   }

  //   results = results.sort(sortQuery);

  //   // var sortKeys = Object.keys(sortQuery);
  //   // for (var i = 0, len = sortKeys.length; i < len; i++) {
  //   //   var sortObject = {};
  //   //   sortObject[sortKeys[i]] = sortQuery[sortKeys[i]];
  //   //   results = results.sort(sortObject);
  //   // }

  //   results.toArray(function (err, docs) {
  //     if (err) throw err;
  //     if (callback) callback(docs);
  //   });


  //   // this.collection.find(query).sort(sortQuery).limit(limit).toArray(function (err, docs) {
  //   //   if (err) throw err;
  //   //   if (callback) callback(docs);
  //   // });
  // }

  // Model.prototype.findById = function (id, callback) {
  //   this.findOne({ "_id": id }, callback);
  // }

  // Model.prototype.setById = function (id, updatedData, callback) {
  //   this.set({ "_id": parseInt(id) }, updatedData, callback);
  // }

  // Model.prototype.unSetById = function (id, field, callback) {
  //   this.unSet({ "_id": parseInt(id) }, field, callback);
  // }

  // Model.prototype.incrementById = function (id, key, amount, callback) {
  //   this.increment({ "_id": parseInt(id) }, key, amount, callback);
  // }

  // Model.prototype.getById = function (id, key, callback) {
  //   this.get({ "_id": parseInt(id) }, key, callback);
  // }

  // Model.prototype.pushById = function (id, field, value, callback) {
  //   this.push({ "_id": parseInt(id) }, field, value, callback);
  // }

  // Model.prototype.pushAllById = function (id, field, value, callback) {
  //   this.pushAll({ "_id": parseInt(id) }, field, value, callback);
  // }

  // Model.prototype.pullById = function (id, field, value, callback) {
  //   this.pull({ "_id": parseInt(id) }, field, value, callback);
  // }

  // Model.prototype.destroyById = function (id, callback) {
  //   this.destroy({ "_id": parseInt(id) }, callback);
  // }
}
