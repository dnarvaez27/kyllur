"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : (0, _typeof2["default"])(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if ((typeof Reflect === "undefined" ? "undefined" : (0, _typeof2["default"])(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongodb_1 = require("mongodb");

var utils_1 = require("./utils");

var utils_2 = require("./utils");

var url = utils_2.getEnvVar('MONGODB_URI');
var dbName = 'kyllur';
console.log('MDB:', url, dbName);
;

var Functions =
/*#__PURE__*/
function () {
  function Functions() {
    (0, _classCallCheck2["default"])(this, Functions);
  }

  (0, _createClass2["default"])(Functions, null, [{
    key: "get",
    value: function get(_ref) {
      var db, collection_name, query, _ref$limit, limit, _ref$sort, sort;

      return _regenerator["default"].async(function get$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              db = _ref.db, collection_name = _ref.collection_name, query = _ref.query, _ref$limit = _ref.limit, limit = _ref$limit === void 0 ? 10000 : _ref$limit, _ref$sort = _ref.sort, sort = _ref$sort === void 0 ? {} : _ref$sort;
              _context.next = 3;
              return _regenerator["default"].awrap(db.collection(collection_name).find(query).sort(sort).limit(limit).toArray());

            case 3:
              return _context.abrupt("return", _context.sent);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "getOne",
    value: function getOne(_ref2) {
      var db, collection_name, query;
      return _regenerator["default"].async(function getOne$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              db = _ref2.db, collection_name = _ref2.collection_name, query = _ref2.query;
              _context2.next = 3;
              return _regenerator["default"].awrap(db.collection(collection_name).findOne(query));

            case 3:
              return _context2.abrupt("return", _context2.sent);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "createOne",
    value: function createOne(_ref3) {
      var db, collection_name, data;
      return _regenerator["default"].async(function createOne$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              db = _ref3.db, collection_name = _ref3.collection_name, data = _ref3.data;
              _context3.next = 3;
              return _regenerator["default"].awrap(db.collection(collection_name).insertOne(data));

            case 3:
              return _context3.abrupt("return", _context3.sent);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }, {
    key: "createMany",
    value: function createMany(_ref4) {
      var db, collection_name, data;
      return _regenerator["default"].async(function createMany$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              db = _ref4.db, collection_name = _ref4.collection_name, data = _ref4.data;
              _context4.next = 3;
              return _regenerator["default"].awrap(db.collection(collection_name).insertMany(data));

            case 3:
              return _context4.abrupt("return", _context4.sent);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  }, {
    key: "deleteOne",
    value: function deleteOne(_ref5) {
      var db, collection_name, query;
      return _regenerator["default"].async(function deleteOne$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              db = _ref5.db, collection_name = _ref5.collection_name, query = _ref5.query;
              _context5.next = 3;
              return _regenerator["default"].awrap(db.collection(collection_name).deleteOne(query));

            case 3:
              return _context5.abrupt("return", _context5.sent);

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      });
    }
  }, {
    key: "deleteMany",
    value: function deleteMany(_ref6) {
      var db, collection_name, query;
      return _regenerator["default"].async(function deleteMany$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              db = _ref6.db, collection_name = _ref6.collection_name, query = _ref6.query;
              _context6.next = 3;
              return _regenerator["default"].awrap(db.collection(collection_name).deleteMany(query));

            case 3:
              return _context6.abrupt("return", _context6.sent);

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      });
    }
  }, {
    key: "updateOne",
    value: function updateOne(_ref7) {
      var db, collection_name, query, values;
      return _regenerator["default"].async(function updateOne$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              db = _ref7.db, collection_name = _ref7.collection_name, query = _ref7.query, values = _ref7.values;
              _context7.next = 3;
              return _regenerator["default"].awrap(db.collection(collection_name).updateOne(query, values));

            case 3:
              return _context7.abrupt("return", _context7.sent);

            case 4:
            case "end":
              return _context7.stop();
          }
        }
      });
    }
  }, {
    key: "updateMany",
    value: function updateMany(_ref8) {
      var db, collection_name, query, values;
      return _regenerator["default"].async(function updateMany$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              db = _ref8.db, collection_name = _ref8.collection_name, query = _ref8.query, values = _ref8.values;
              _context8.next = 3;
              return _regenerator["default"].awrap(db.collection(collection_name).updateMany(query, values));

            case 3:
              return _context8.abrupt("return", _context8.sent);

            case 4:
            case "end":
              return _context8.stop();
          }
        }
      });
    }
  }, {
    key: "join",
    value: function join(_ref9) {
      var db, collection_name, aggregate;
      return _regenerator["default"].async(function join$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              db = _ref9.db, collection_name = _ref9.collection_name, aggregate = _ref9.aggregate;
              _context9.next = 3;
              return _regenerator["default"].awrap(db.collection(collection_name).aggregate(aggregate).toArray());

            case 3:
              return _context9.abrupt("return", _context9.sent);

            case 4:
            case "end":
              return _context9.stop();
          }
        }
      });
    }
  }]);
  return Functions;
}();

__decorate([utils_2.decorators.interceptAsync({
  before: function before(_, args) {
    return console.log("FUN: GET(".concat(args[0].collection_name, ": ").concat(JSON.stringify(args[0].query), ")"));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", Promise)], Functions, "get", null);

__decorate([utils_2.decorators.interceptAsync({
  before: function before(_, args) {
    return console.log("FUN: GET_ONE(".concat(args[0].query, ")"));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", Promise)], Functions, "getOne", null);

__decorate([utils_2.decorators.interceptAsync({
  before: function before(_, args) {
    return console.log("FUN: CREATE_ONE(".concat(JSON.stringify(args[0].data), ")"));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", Promise)], Functions, "createOne", null);

__decorate([utils_2.decorators.interceptAsync({
  before: function before(_, args) {
    return console.log("FUN: CREATE_MANY(".concat(args[0].data, ")"));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", Promise)], Functions, "createMany", null);

__decorate([utils_2.decorators.interceptAsync({
  before: function before(_, args) {
    return console.log("FUN: DELETE_ONE(".concat(args[0].query, ")"));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", Promise)], Functions, "deleteOne", null);

__decorate([utils_2.decorators.interceptAsync({
  before: function before(_, args) {
    return console.log("FUN: DELETE_MANY(".concat(args[0].query, ")"));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", Promise)], Functions, "deleteMany", null);

__decorate([utils_2.decorators.interceptAsync({
  before: function before(_, args) {
    return console.log("FUN: UPDATE_ONE(".concat(args[0].query, ")"));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", Promise)], Functions, "updateOne", null);

__decorate([utils_2.decorators.interceptAsync({
  before: function before(_, args) {
    return console.log("FUN: UPDATE_MANY(".concat(args[0].query, ")"));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", Promise)], Functions, "updateMany", null);

__decorate([utils_2.decorators.interceptAsync({
  before: function before(_, args) {
    return console.log("FUN: JOIN(".concat(args[0].aggregate, ")"));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", Promise)], Functions, "join", null);

exports.Functions = Functions;

var DB =
/*#__PURE__*/
function () {
  function DB(url, database) {
    (0, _classCallCheck2["default"])(this, DB);
    this.url = url;
    this.database = database;
  }

  (0, _createClass2["default"])(DB, [{
    key: "getDBConnection",
    value: function getDBConnection() {
      return _regenerator["default"].async(function getDBConnection$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              return _context10.abrupt("return", mongodb_1.MongoClient.connect(this.url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
              }));

            case 1:
            case "end":
              return _context10.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "execQuery",
    value: function execQuery(func, collection_name, query) {
      var args,
          client,
          response,
          _args11 = arguments;
      return _regenerator["default"].async(function execQuery$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              args = _args11.length > 3 && _args11[3] !== undefined ? _args11[3] : {};
              _context11.next = 3;
              return _regenerator["default"].awrap(this.getDBConnection());

            case 3:
              client = _context11.sent;
              _context11.next = 6;
              return _regenerator["default"].awrap(func(_objectSpread({
                db: client.db(this.database),
                collection_name: collection_name,
                query: query
              }, args)));

            case 6:
              response = _context11.sent;
              return _context11.abrupt("return", response);

            case 8:
            case "end":
              return _context11.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getCollections",
    value: function getCollections(onDone) {
      var client, db, colls, collections;
      return _regenerator["default"].async(function getCollections$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return _regenerator["default"].awrap(this.getDBConnection());

            case 2:
              client = _context12.sent;
              db = client.db(this.database);
              colls = db.listCollections({}, {
                nameOnly: true
              });
              collections = [];
              _context12.next = 8;
              return _regenerator["default"].awrap(utils_1.asyncIterate(colls, function (item) {
                if (item) {
                  if (item.type === 'collection') {
                    collections.push(item.name);
                  }
                }
              }));

            case 8:
              onDone(collections);

            case 9:
            case "end":
              return _context12.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "listenToChanges",
    value: function listenToChanges(collectionName) {
      var _this = this;

      var pipeline,
          client,
          db,
          collection,
          stream,
          dbStream,
          _args14 = arguments;
      return _regenerator["default"].async(function listenToChanges$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              pipeline = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : [];
              _context14.next = 3;
              return _regenerator["default"].awrap(this.getDBConnection());

            case 3:
              client = _context14.sent;
              db = client.db(this.database);
              collection = db.collection(collectionName);
              stream = collection.watch(pipeline);
              dbStream = new DBStream(stream, collectionName, function _callee(collectionName) {
                var data;
                return _regenerator["default"].async(function _callee$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
                        return _regenerator["default"].awrap(_this.execQuery(Functions.get, collectionName, {}));

                      case 2:
                        data = _context13.sent;
                        return _context13.abrupt("return", data);

                      case 4:
                      case "end":
                        return _context13.stop();
                    }
                  }
                });
              });
              return _context14.abrupt("return", dbStream);

            case 9:
            case "end":
              return _context14.stop();
          }
        }
      }, null, this);
    }
  }]);
  return DB;
}();

var DBStream =
/*#__PURE__*/
function () {
  function DBStream(stream, collectionName, fetchData) {
    var _this2 = this;

    (0, _classCallCheck2["default"])(this, DBStream);
    this.collectionName = collectionName;
    this.stream = stream;
    this.stream.on('change', function (changedData) {
      return function _callee2() {
        return _regenerator["default"].async(function _callee2$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                return _context15.abrupt("return", _this2.dataChanged(changedData));

              case 1:
              case "end":
                return _context15.stop();
            }
          }
        });
      }();
    });
    this.fetchData = fetchData;
  }

  (0, _createClass2["default"])(DBStream, [{
    key: "setOnDataChanged",
    value: function setOnDataChanged(dataChangedListener) {
      this.dataChangedListener = dataChangedListener;
    }
  }, {
    key: "dataChanged",
    value: function dataChanged(changedData) {
      var data;
      return _regenerator["default"].async(function dataChanged$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return _regenerator["default"].awrap(this.fetchData(this.collectionName));

            case 2:
              data = _context16.sent;

              if (this.dataChangedListener) {
                this.dataChangedListener(data);
              }

            case 4:
            case "end":
              return _context16.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "closeStream",
    value: function closeStream() {
      var _this3 = this;

      (function _callee3() {
        return _regenerator["default"].async(function _callee3$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return _regenerator["default"].awrap(_this3.stream.close());

              case 2:
                return _context17.abrupt("return", _context17.sent);

              case 3:
              case "end":
                return _context17.stop();
            }
          }
        });
      })();
    }
  }]);
  return DBStream;
}();

__decorate([utils_2.decorators.intercept({
  before: function before(obj) {
    return console.log("DBS: Listening from data in ".concat(obj.collectionName));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Function]), __metadata("design:returntype", void 0)], DBStream.prototype, "setOnDataChanged", null);

__decorate([utils_2.decorators.interceptAsync({
  before: function before(obj) {
    return console.log("DBS: Data changed in ".concat(obj.collectionName));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", Promise)], DBStream.prototype, "dataChanged", null);

__decorate([utils_2.decorators.intercept({
  after: function after(obj) {
    return console.log("DBS: Closed Stream ".concat(obj.collectionName));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], DBStream.prototype, "closeStream", null);

exports.DBStream = DBStream;
var instance = new DB(url, dbName);
Object.freeze(instance);
exports["default"] = instance;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3RzL3V0aWxzL2RiLmpzIl0sIm5hbWVzIjpbIl9fZGVjb3JhdGUiLCJkZWNvcmF0b3JzIiwidGFyZ2V0Iiwia2V5IiwiZGVzYyIsImMiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJyIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZCIsIlJlZmxlY3QiLCJkZWNvcmF0ZSIsImkiLCJkZWZpbmVQcm9wZXJ0eSIsIl9fbWV0YWRhdGEiLCJrIiwidiIsIm1ldGFkYXRhIiwiZXhwb3J0cyIsInZhbHVlIiwibW9uZ29kYl8xIiwicmVxdWlyZSIsInV0aWxzXzEiLCJ1dGlsc18yIiwidXJsIiwiZ2V0RW52VmFyIiwiZGJOYW1lIiwiY29uc29sZSIsImxvZyIsIkZ1bmN0aW9ucyIsImRiIiwiY29sbGVjdGlvbl9uYW1lIiwicXVlcnkiLCJsaW1pdCIsInNvcnQiLCJjb2xsZWN0aW9uIiwiZmluZCIsInRvQXJyYXkiLCJmaW5kT25lIiwiZGF0YSIsImluc2VydE9uZSIsImluc2VydE1hbnkiLCJkZWxldGVPbmUiLCJkZWxldGVNYW55IiwidmFsdWVzIiwidXBkYXRlT25lIiwidXBkYXRlTWFueSIsImFnZ3JlZ2F0ZSIsImludGVyY2VwdEFzeW5jIiwiYmVmb3JlIiwiXyIsImFyZ3MiLCJKU09OIiwic3RyaW5naWZ5IiwiRnVuY3Rpb24iLCJQcm9taXNlIiwiREIiLCJkYXRhYmFzZSIsIk1vbmdvQ2xpZW50IiwiY29ubmVjdCIsInVzZU5ld1VybFBhcnNlciIsInVzZVVuaWZpZWRUb3BvbG9neSIsImZ1bmMiLCJnZXREQkNvbm5lY3Rpb24iLCJjbGllbnQiLCJyZXNwb25zZSIsIm9uRG9uZSIsImNvbGxzIiwibGlzdENvbGxlY3Rpb25zIiwibmFtZU9ubHkiLCJjb2xsZWN0aW9ucyIsImFzeW5jSXRlcmF0ZSIsIml0ZW0iLCJ0eXBlIiwicHVzaCIsIm5hbWUiLCJjb2xsZWN0aW9uTmFtZSIsInBpcGVsaW5lIiwic3RyZWFtIiwid2F0Y2giLCJkYlN0cmVhbSIsIkRCU3RyZWFtIiwiZXhlY1F1ZXJ5IiwiZ2V0IiwiZmV0Y2hEYXRhIiwib24iLCJjaGFuZ2VkRGF0YSIsImRhdGFDaGFuZ2VkIiwiZGF0YUNoYW5nZWRMaXN0ZW5lciIsImNsb3NlIiwiaW50ZXJjZXB0Iiwib2JqIiwicHJvdG90eXBlIiwiYWZ0ZXIiLCJpbnN0YW5jZSIsImZyZWV6ZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLElBQUlBLFVBQVUsR0FBSSxVQUFRLFNBQUtBLFVBQWQsSUFBNkIsVUFBVUMsVUFBVixFQUFzQkMsTUFBdEIsRUFBOEJDLEdBQTlCLEVBQW1DQyxJQUFuQyxFQUF5QztBQUNuRixNQUFJQyxDQUFDLEdBQUdDLFNBQVMsQ0FBQ0MsTUFBbEI7QUFBQSxNQUEwQkMsQ0FBQyxHQUFHSCxDQUFDLEdBQUcsQ0FBSixHQUFRSCxNQUFSLEdBQWlCRSxJQUFJLEtBQUssSUFBVCxHQUFnQkEsSUFBSSxHQUFHSyxNQUFNLENBQUNDLHdCQUFQLENBQWdDUixNQUFoQyxFQUF3Q0MsR0FBeEMsQ0FBdkIsR0FBc0VDLElBQXJIO0FBQUEsTUFBMkhPLENBQTNIO0FBQ0EsTUFBSSxRQUFPQyxPQUFQLDBEQUFPQSxPQUFQLE9BQW1CLFFBQW5CLElBQStCLE9BQU9BLE9BQU8sQ0FBQ0MsUUFBZixLQUE0QixVQUEvRCxFQUEyRUwsQ0FBQyxHQUFHSSxPQUFPLENBQUNDLFFBQVIsQ0FBaUJaLFVBQWpCLEVBQTZCQyxNQUE3QixFQUFxQ0MsR0FBckMsRUFBMENDLElBQTFDLENBQUosQ0FBM0UsS0FDSyxLQUFLLElBQUlVLENBQUMsR0FBR2IsVUFBVSxDQUFDTSxNQUFYLEdBQW9CLENBQWpDLEVBQW9DTyxDQUFDLElBQUksQ0FBekMsRUFBNENBLENBQUMsRUFBN0M7QUFBaUQsUUFBSUgsQ0FBQyxHQUFHVixVQUFVLENBQUNhLENBQUQsQ0FBbEIsRUFBdUJOLENBQUMsR0FBRyxDQUFDSCxDQUFDLEdBQUcsQ0FBSixHQUFRTSxDQUFDLENBQUNILENBQUQs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VSxDQUFDLGFBQUQsRUFBZ0J3QyxRQUFoQixDQUZILEVBR1B4QyxVQUFVLENBQUMsbUJBQUQsRUFBc0IsRUFBdEIsQ0FISCxFQUlQQSxVQUFVLENBQUMsbUJBQUQsRUFBc0IsS0FBSyxDQUEzQixDQUpILENBQUQsRUFLUG1FLFFBQVEsQ0FBQ1csU0FMRixFQUthLGFBTGIsRUFLNEIsSUFMNUIsQ0FBVjs7QUFNQTFFLE9BQU8sQ0FBQytELFFBQVIsR0FBbUJBLFFBQW5CO0FBQ0EsSUFBTWEsUUFBUSxHQUFHLElBQUl0QyxFQUFKLENBQU9oQyxHQUFQLEVBQVlFLE1BQVosQ0FBakI7QUFDQW5CLE1BQU0sQ0FBQ3dGLE1BQVAsQ0FBY0QsUUFBZDtBQUNBNUUsT0FBTyxXQUFQLEdBQWtCNEUsUUFBbEIiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgbW9uZ29kYl8xID0gcmVxdWlyZShcIm1vbmdvZGJcIik7XHJcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcclxuY29uc3QgdXRpbHNfMiA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xyXG5jb25zdCB1cmwgPSB1dGlsc18yLmdldEVudlZhcignTU9OR09EQl9VUkknKTtcclxuY29uc3QgZGJOYW1lID0gJ2t5bGx1cic7XHJcbmNvbnNvbGUubG9nKCdNREI6JywgdXJsLCBkYk5hbWUpO1xyXG47XHJcbmNsYXNzIEZ1bmN0aW9ucyB7XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0KHsgZGIsIGNvbGxlY3Rpb25fbmFtZSwgcXVlcnksIGxpbWl0ID0gMTAwMDAsIHNvcnQgPSB7fSB9KSB7XHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IChkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb25fbmFtZSlcclxuICAgICAgICAgICAgLmZpbmQocXVlcnkpXHJcbiAgICAgICAgICAgIC5zb3J0KHNvcnQpXHJcbiAgICAgICAgICAgIC5saW1pdChsaW1pdClcclxuICAgICAgICAgICAgLnRvQXJyYXkoKSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0T25lKHsgZGIsIGNvbGxlY3Rpb25fbmFtZSwgcXVlcnkgfSkge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCAoZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uX25hbWUpXHJcbiAgICAgICAgICAgIC5maW5kT25lKHF1ZXJ5KSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgY3JlYXRlT25lKHsgZGIsIGNvbGxlY3Rpb25fbmFtZSwgZGF0YSB9KSB7XHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IChkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb25fbmFtZSlcclxuICAgICAgICAgICAgLmluc2VydE9uZShkYXRhKSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgY3JlYXRlTWFueSh7IGRiLCBjb2xsZWN0aW9uX25hbWUsIGRhdGEgfSkge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCAoZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uX25hbWUpXHJcbiAgICAgICAgICAgIC5pbnNlcnRNYW55KGRhdGEpKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBkZWxldGVPbmUoeyBkYiwgY29sbGVjdGlvbl9uYW1lLCBxdWVyeSB9KSB7XHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IChkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb25fbmFtZSlcclxuICAgICAgICAgICAgLmRlbGV0ZU9uZShxdWVyeSkpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZU1hbnkoeyBkYiwgY29sbGVjdGlvbl9uYW1lLCBxdWVyeSB9KSB7XHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IChkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb25fbmFtZSlcclxuICAgICAgICAgICAgLmRlbGV0ZU1hbnkocXVlcnkpKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyB1cGRhdGVPbmUoeyBkYiwgY29sbGVjdGlvbl9uYW1lLCBxdWVyeSwgdmFsdWVzIH0pIHtcclxuICAgICAgICByZXR1cm4gYXdhaXQgKGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKVxyXG4gICAgICAgICAgICAudXBkYXRlT25lKHF1ZXJ5LCB2YWx1ZXMpKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyB1cGRhdGVNYW55KHsgZGIsIGNvbGxlY3Rpb25fbmFtZSwgcXVlcnksIHZhbHVlcyB9KSB7XHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IChkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb25fbmFtZSlcclxuICAgICAgICAgICAgLnVwZGF0ZU1hbnkocXVlcnksIHZhbHVlcykpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGpvaW4oeyBkYiwgY29sbGVjdGlvbl9uYW1lLCBhZ2dyZWdhdGUgfSkge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCAoZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uX25hbWUpXHJcbiAgICAgICAgICAgIC5hZ2dyZWdhdGUoYWdncmVnYXRlKVxyXG4gICAgICAgICAgICAudG9BcnJheSgpKTtcclxuICAgIH1cclxufVxyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzIuZGVjb3JhdG9ycy5pbnRlcmNlcHRBc3luYyh7IGJlZm9yZTogKF8sIGFyZ3MpID0+IGNvbnNvbGUubG9nKGBGVU46IEdFVCgke2FyZ3NbMF0uY29sbGVjdGlvbl9uYW1lfTogJHtKU09OLnN0cmluZ2lmeShhcmdzWzBdLnF1ZXJ5KX0pYCkgfSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBQcm9taXNlKVxyXG5dLCBGdW5jdGlvbnMsIFwiZ2V0XCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzIuZGVjb3JhdG9ycy5pbnRlcmNlcHRBc3luYyh7IGJlZm9yZTogKF8sIGFyZ3MpID0+IGNvbnNvbGUubG9nKGBGVU46IEdFVF9PTkUoJHthcmdzWzBdLnF1ZXJ5fSlgKSB9KSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdF0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIFByb21pc2UpXHJcbl0sIEZ1bmN0aW9ucywgXCJnZXRPbmVcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMi5kZWNvcmF0b3JzLmludGVyY2VwdEFzeW5jKHsgYmVmb3JlOiAoXywgYXJncykgPT4gY29uc29sZS5sb2coYEZVTjogQ1JFQVRFX09ORSgke0pTT04uc3RyaW5naWZ5KGFyZ3NbMF0uZGF0YSl9KWApIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgUHJvbWlzZSlcclxuXSwgRnVuY3Rpb25zLCBcImNyZWF0ZU9uZVwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18yLmRlY29yYXRvcnMuaW50ZXJjZXB0QXN5bmMoeyBiZWZvcmU6IChfLCBhcmdzKSA9PiBjb25zb2xlLmxvZyhgRlVOOiBDUkVBVEVfTUFOWSgke2FyZ3NbMF0uZGF0YX0pYCkgfSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBQcm9taXNlKVxyXG5dLCBGdW5jdGlvbnMsIFwiY3JlYXRlTWFueVwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18yLmRlY29yYXRvcnMuaW50ZXJjZXB0QXN5bmMoeyBiZWZvcmU6IChfLCBhcmdzKSA9PiBjb25zb2xlLmxvZyhgRlVOOiBERUxFVEVfT05FKCR7YXJnc1swXS5xdWVyeX0pYCkgfSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBQcm9taXNlKVxyXG5dLCBGdW5jdGlvbnMsIFwiZGVsZXRlT25lXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzIuZGVjb3JhdG9ycy5pbnRlcmNlcHRBc3luYyh7IGJlZm9yZTogKF8sIGFyZ3MpID0+IGNvbnNvbGUubG9nKGBGVU46IERFTEVURV9NQU5ZKCR7YXJnc1swXS5xdWVyeX0pYCkgfSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBQcm9taXNlKVxyXG5dLCBGdW5jdGlvbnMsIFwiZGVsZXRlTWFueVwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18yLmRlY29yYXRvcnMuaW50ZXJjZXB0QXN5bmMoeyBiZWZvcmU6IChfLCBhcmdzKSA9PiBjb25zb2xlLmxvZyhgRlVOOiBVUERBVEVfT05FKCR7YXJnc1swXS5xdWVyeX0pYCkgfSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBQcm9taXNlKVxyXG5dLCBGdW5jdGlvbnMsIFwidXBkYXRlT25lXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzIuZGVjb3JhdG9ycy5pbnRlcmNlcHRBc3luYyh7IGJlZm9yZTogKF8sIGFyZ3MpID0+IGNvbnNvbGUubG9nKGBGVU46IFVQREFURV9NQU5ZKCR7YXJnc1swXS5xdWVyeX0pYCkgfSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBQcm9taXNlKVxyXG5dLCBGdW5jdGlvbnMsIFwidXBkYXRlTWFueVwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18yLmRlY29yYXRvcnMuaW50ZXJjZXB0QXN5bmMoeyBiZWZvcmU6IChfLCBhcmdzKSA9PiBjb25zb2xlLmxvZyhgRlVOOiBKT0lOKCR7YXJnc1swXS5hZ2dyZWdhdGV9KWApIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgUHJvbWlzZSlcclxuXSwgRnVuY3Rpb25zLCBcImpvaW5cIiwgbnVsbCk7XHJcbmV4cG9ydHMuRnVuY3Rpb25zID0gRnVuY3Rpb25zO1xyXG5jbGFzcyBEQiB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1cmwsIGRhdGFiYXNlKSB7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5kYXRhYmFzZSA9IGRhdGFiYXNlO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgZ2V0REJDb25uZWN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBtb25nb2RiXzEuTW9uZ29DbGllbnQuY29ubmVjdCh0aGlzLnVybCwgeyB1c2VOZXdVcmxQYXJzZXI6IHRydWUsIHVzZVVuaWZpZWRUb3BvbG9neTogdHJ1ZSB9KTtcclxuICAgIH1cclxuICAgIDtcclxuICAgIGFzeW5jIGV4ZWNRdWVyeShmdW5jLCBjb2xsZWN0aW9uX25hbWUsIHF1ZXJ5LCBhcmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCB0aGlzLmdldERCQ29ubmVjdGlvbigpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZnVuYyh7IGRiOiBjbGllbnQuZGIodGhpcy5kYXRhYmFzZSksIGNvbGxlY3Rpb25fbmFtZSwgcXVlcnksIC4uLmFyZ3MgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgfVxyXG4gICAgO1xyXG4gICAgYXN5bmMgZ2V0Q29sbGVjdGlvbnMob25Eb25lKSB7XHJcbiAgICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgdGhpcy5nZXREQkNvbm5lY3Rpb24oKTtcclxuICAgICAgICBjb25zdCBkYiA9IGNsaWVudC5kYih0aGlzLmRhdGFiYXNlKTtcclxuICAgICAgICBjb25zdCBjb2xscyA9IGRiLmxpc3RDb2xsZWN0aW9ucyh7fSwgeyBuYW1lT25seTogdHJ1ZSB9KTtcclxuICAgICAgICBsZXQgY29sbGVjdGlvbnMgPSBbXTtcclxuICAgICAgICBhd2FpdCB1dGlsc18xLmFzeW5jSXRlcmF0ZShjb2xscywgKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLnR5cGUgPT09ICdjb2xsZWN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25zLnB1c2goaXRlbS5uYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9uRG9uZShjb2xsZWN0aW9ucyk7XHJcbiAgICB9XHJcbiAgICA7XHJcbiAgICBhc3luYyBsaXN0ZW5Ub0NoYW5nZXMoY29sbGVjdGlvbk5hbWUsIHBpcGVsaW5lID0gW10pIHtcclxuICAgICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCB0aGlzLmdldERCQ29ubmVjdGlvbigpO1xyXG4gICAgICAgIGNvbnN0IGRiID0gY2xpZW50LmRiKHRoaXMuZGF0YWJhc2UpO1xyXG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb25OYW1lKTtcclxuICAgICAgICBjb25zdCBzdHJlYW0gPSBjb2xsZWN0aW9uLndhdGNoKHBpcGVsaW5lKTtcclxuICAgICAgICBjb25zdCBkYlN0cmVhbSA9IG5ldyBEQlN0cmVhbShzdHJlYW0sIGNvbGxlY3Rpb25OYW1lLCBhc3luYyAoY29sbGVjdGlvbk5hbWUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuZXhlY1F1ZXJ5KEZ1bmN0aW9ucy5nZXQsIGNvbGxlY3Rpb25OYW1lLCB7fSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBkYlN0cmVhbTtcclxuICAgIH1cclxufVxyXG5jbGFzcyBEQlN0cmVhbSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzdHJlYW0sIGNvbGxlY3Rpb25OYW1lLCBmZXRjaERhdGEpIHtcclxuICAgICAgICB0aGlzLmNvbGxlY3Rpb25OYW1lID0gY29sbGVjdGlvbk5hbWU7XHJcbiAgICAgICAgdGhpcy5zdHJlYW0gPSBzdHJlYW07XHJcbiAgICAgICAgdGhpcy5zdHJlYW0ub24oJ2NoYW5nZScsIChjaGFuZ2VkRGF0YSkgPT4gKGFzeW5jICgpID0+IHRoaXMuZGF0YUNoYW5nZWQoY2hhbmdlZERhdGEpKSgpKTtcclxuICAgICAgICB0aGlzLmZldGNoRGF0YSA9IGZldGNoRGF0YTtcclxuICAgIH1cclxuICAgIHNldE9uRGF0YUNoYW5nZWQoZGF0YUNoYW5nZWRMaXN0ZW5lcikge1xyXG4gICAgICAgIHRoaXMuZGF0YUNoYW5nZWRMaXN0ZW5lciA9IGRhdGFDaGFuZ2VkTGlzdGVuZXI7XHJcbiAgICB9XHJcbiAgICBhc3luYyBkYXRhQ2hhbmdlZChjaGFuZ2VkRGF0YSkge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLmZldGNoRGF0YSh0aGlzLmNvbGxlY3Rpb25OYW1lKTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhQ2hhbmdlZExpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YUNoYW5nZWRMaXN0ZW5lcihkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbG9zZVN0cmVhbSgpIHtcclxuICAgICAgICAoYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5zdHJlYW0uY2xvc2UoKSkoKTtcclxuICAgIH1cclxufVxyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzIuZGVjb3JhdG9ycy5pbnRlcmNlcHQoeyBiZWZvcmU6IChvYmopID0+IGNvbnNvbGUubG9nKGBEQlM6IExpc3RlbmluZyBmcm9tIGRhdGEgaW4gJHtvYmouY29sbGVjdGlvbk5hbWV9YCkgfSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtGdW5jdGlvbl0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgREJTdHJlYW0ucHJvdG90eXBlLCBcInNldE9uRGF0YUNoYW5nZWRcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMi5kZWNvcmF0b3JzLmludGVyY2VwdEFzeW5jKHsgYmVmb3JlOiAob2JqKSA9PiBjb25zb2xlLmxvZyhgREJTOiBEYXRhIGNoYW5nZWQgaW4gJHtvYmouY29sbGVjdGlvbk5hbWV9YCkgfSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBQcm9taXNlKVxyXG5dLCBEQlN0cmVhbS5wcm90b3R5cGUsIFwiZGF0YUNoYW5nZWRcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMi5kZWNvcmF0b3JzLmludGVyY2VwdCh7IGFmdGVyOiAob2JqKSA9PiBjb25zb2xlLmxvZyhgREJTOiBDbG9zZWQgU3RyZWFtICR7b2JqLmNvbGxlY3Rpb25OYW1lfWApIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbXSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBEQlN0cmVhbS5wcm90b3R5cGUsIFwiY2xvc2VTdHJlYW1cIiwgbnVsbCk7XHJcbmV4cG9ydHMuREJTdHJlYW0gPSBEQlN0cmVhbTtcclxuY29uc3QgaW5zdGFuY2UgPSBuZXcgREIodXJsLCBkYk5hbWUpO1xyXG5PYmplY3QuZnJlZXplKGluc3RhbmNlKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gaW5zdGFuY2U7XHJcbiJdfQ==