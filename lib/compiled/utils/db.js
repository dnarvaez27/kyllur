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
      var db, collection_name, query, _ref$args, args;

      return _regenerator["default"].async(function get$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              db = _ref.db, collection_name = _ref.collection_name, query = _ref.query, _ref$args = _ref.args, args = _ref$args === void 0 ? {
                limit: 10000,
                sort: {}
              } : _ref$args;
              _context.next = 3;
              return _regenerator["default"].awrap(db.collection(collection_name).find(query).sort(args.sort).limit(args.limit).toArray());

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
              db = _ref3.db, collection_name = _ref3.collection_name, data = _ref3.args.data;
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
              db = _ref4.db, collection_name = _ref4.collection_name, data = _ref4.args.data;
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
              db = _ref7.db, collection_name = _ref7.collection_name, query = _ref7.query, values = _ref7.args.values;
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
              db = _ref8.db, collection_name = _ref8.collection_name, query = _ref8.query, values = _ref8.args.values;
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
              db = _ref9.db, collection_name = _ref9.collection_name, aggregate = _ref9.args.aggregate;
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
    return console.log("FUN: CREATE_ONE(".concat(args[0].args, ")"));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", Promise)], Functions, "createOne", null);

__decorate([utils_2.decorators.interceptAsync({
  before: function before(_, args) {
    return console.log("FUN: CREATE_MANY(".concat(args[0].args, ")"));
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
    return console.log("FUN: JOIN(".concat(args[0].args, ")"));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3RzL3V0aWxzL2RiLmpzIl0sIm5hbWVzIjpbIl9fZGVjb3JhdGUiLCJkZWNvcmF0b3JzIiwidGFyZ2V0Iiwia2V5IiwiZGVzYyIsImMiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJyIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZCIsIlJlZmxlY3QiLCJkZWNvcmF0ZSIsImkiLCJkZWZpbmVQcm9wZXJ0eSIsIl9fbWV0YWRhdGEiLCJrIiwidiIsIm1ldGFkYXRhIiwiZXhwb3J0cyIsInZhbHVlIiwibW9uZ29kYl8xIiwicmVxdWlyZSIsInV0aWxzXzEiLCJ1dGlsc18yIiwidXJsIiwiZ2V0RW52VmFyIiwiZGJOYW1lIiwiY29uc29sZSIsImxvZyIsIkZ1bmN0aW9ucyIsImRiIiwiY29sbGVjdGlvbl9uYW1lIiwicXVlcnkiLCJhcmdzIiwibGltaXQiLCJzb3J0IiwiY29sbGVjdGlvbiIsImZpbmQiLCJ0b0FycmF5IiwiZmluZE9uZSIsImRhdGEiLCJpbnNlcnRPbmUiLCJpbnNlcnRNYW55IiwiZGVsZXRlT25lIiwiZGVsZXRlTWFueSIsInZhbHVlcyIsInVwZGF0ZU9uZSIsInVwZGF0ZU1hbnkiLCJhZ2dyZWdhdGUiLCJpbnRlcmNlcHRBc3luYyIsImJlZm9yZSIsIl8iLCJKU09OIiwic3RyaW5naWZ5IiwiRnVuY3Rpb24iLCJQcm9taXNlIiwiREIiLCJkYXRhYmFzZSIsIk1vbmdvQ2xpZW50IiwiY29ubmVjdCIsInVzZU5ld1VybFBhcnNlciIsInVzZVVuaWZpZWRUb3BvbG9neSIsImZ1bmMiLCJnZXREQkNvbm5lY3Rpb24iLCJjbGllbnQiLCJyZXNwb25zZSIsIm9uRG9uZSIsImNvbGxzIiwibGlzdENvbGxlY3Rpb25zIiwibmFtZU9ubHkiLCJjb2xsZWN0aW9ucyIsImFzeW5jSXRlcmF0ZSIsIml0ZW0iLCJ0eXBlIiwicHVzaCIsIm5hbWUiLCJjb2xsZWN0aW9uTmFtZSIsInBpcGVsaW5lIiwic3RyZWFtIiwid2F0Y2giLCJkYlN0cmVhbSIsIkRCU3RyZWFtIiwiZXhlY1F1ZXJ5IiwiZ2V0IiwiZmV0Y2hEYXRhIiwib24iLCJjaGFuZ2VkRGF0YSIsImRhdGFDaGFuZ2VkIiwiZGF0YUNoYW5nZWRMaXN0ZW5lciIsImNsb3NlIiwiaW50ZXJjZXB0Iiwib2JqIiwicHJvdG90eXBlIiwiYWZ0ZXIiLCJpbnN0YW5jZSIsImZyZWV6ZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLElBQUlBLFVBQVUsR0FBSSxVQUFRLFNBQUtBLFVBQWQsSUFBNkIsVUFBVUMsVUFBVixFQUFzQkMsTUFBdEIsRUFBOEJDLEdBQTlCLEVBQW1DQyxJQUFuQyxFQUF5QztBQUNuRixNQUFJQyxDQUFDLEdBQUdDLFNBQVMsQ0FBQ0MsTUFBbEI7QUFBQSxNQUEwQkMsQ0FBQyxHQUFHSCxDQUFDLEdBQUcsQ0FBSixHQUFRSCxNQUFSLEdBQWlCRSxJQUFJLEtBQUssSUFBVCxHQUFnQkEsSUFBSSxHQUFHSyxNQUFNLENBQUNDLHdCQUFQLENBQWdDUixNQUFoQyxFQUF3Q0MsR0FBeEMsQ0FBdkIsR0FBc0VDLElBQXJIO0FBQUEsTUFBMkhPLENBQTNIO0FBQ0EsTUFBSSxRQUFPQyxPQUFQLDBEQUFPQSxPQUFQLE9BQW1CLFFBQW5CLElBQStCLE9BQU9BLE9BQU8sQ0FBQ0MsUUFBZixLQUE0QixVQUEvRCxFQUEyRUwsQ0FBQyxHQUFHSSxPQUFPLENBQUNDLFFBQVIsQ0FBaUJaLFVBQWpCLEVBQTZCQyxNQUE3QixFQUFxQ0MsR0FBckMsRUFBMENDLElBQTFDLENBQUosQ0FBM0UsS0FDSyxLQUFLLElBQUlVLENBQUMsR0FBR2IsVUFBVSxDQUFDTSxNQUFYLEdBQW9CLENBQWpDLEVBQW9DTyxDQUFDLElBQUksQ0FBekMsRUFBNENBLENBQUMsRUFBN0M7QUFBaUQsUUFBSUgsQ0FBQyxHQUFHVixVQUFVLENBQUNhLENBQUQsQ0FBbEIsRUFBdUJOLENBQUMsR0FBRyxDQUFDSCxDQUFDLEdBQUcsQ0FBSixHQUFRTSxDQUFDLENBQUNILENBQUQs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R0FBRyxDQUFDZixjQUF0QyxFQUFUO0FBQUE7QUFBVCxDQUE3QixDQURPLEVBRVA5RCxVQUFVLENBQUMsYUFBRCxFQUFnQndDLFFBQWhCLENBRkgsRUFHUHhDLFVBQVUsQ0FBQyxtQkFBRCxFQUFzQixFQUF0QixDQUhILEVBSVBBLFVBQVUsQ0FBQyxtQkFBRCxFQUFzQixLQUFLLENBQTNCLENBSkgsQ0FBRCxFQUtQbUUsUUFBUSxDQUFDVyxTQUxGLEVBS2EsYUFMYixFQUs0QixJQUw1QixDQUFWOztBQU1BMUUsT0FBTyxDQUFDK0QsUUFBUixHQUFtQkEsUUFBbkI7QUFDQSxJQUFNYSxRQUFRLEdBQUcsSUFBSXRDLEVBQUosQ0FBT2hDLEdBQVAsRUFBWUUsTUFBWixDQUFqQjtBQUNBbkIsTUFBTSxDQUFDd0YsTUFBUCxDQUFjRCxRQUFkO0FBQ0E1RSxPQUFPLFdBQVAsR0FBa0I0RSxRQUFsQiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59O1xyXG52YXIgX19tZXRhZGF0YSA9ICh0aGlzICYmIHRoaXMuX19tZXRhZGF0YSkgfHwgZnVuY3Rpb24gKGssIHYpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShrLCB2KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBtb25nb2RiXzEgPSByZXF1aXJlKFwibW9uZ29kYlwiKTtcclxuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xyXG5jb25zdCB1dGlsc18yID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XHJcbmNvbnN0IHVybCA9IHV0aWxzXzIuZ2V0RW52VmFyKCdNT05HT0RCX1VSSScpO1xyXG5jb25zdCBkYk5hbWUgPSAna3lsbHVyJztcclxuY29uc29sZS5sb2coJ01EQjonLCB1cmwsIGRiTmFtZSk7XHJcbjtcclxuY2xhc3MgRnVuY3Rpb25zIHtcclxuICAgIHN0YXRpYyBhc3luYyBnZXQoeyBkYiwgY29sbGVjdGlvbl9uYW1lLCBxdWVyeSwgYXJncyA9IHsgbGltaXQ6IDEwMDAwLCBzb3J0OiB7fSB9IH0pIHtcclxuICAgICAgICByZXR1cm4gYXdhaXQgKGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKVxyXG4gICAgICAgICAgICAuZmluZChxdWVyeSlcclxuICAgICAgICAgICAgLnNvcnQoYXJncy5zb3J0KVxyXG4gICAgICAgICAgICAubGltaXQoYXJncy5saW1pdClcclxuICAgICAgICAgICAgLnRvQXJyYXkoKSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0T25lKHsgZGIsIGNvbGxlY3Rpb25fbmFtZSwgcXVlcnkgfSkge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCAoZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uX25hbWUpXHJcbiAgICAgICAgICAgIC5maW5kT25lKHF1ZXJ5KSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgY3JlYXRlT25lKHsgZGIsIGNvbGxlY3Rpb25fbmFtZSwgYXJnczogeyBkYXRhIH0gfSkge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCAoZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uX25hbWUpXHJcbiAgICAgICAgICAgIC5pbnNlcnRPbmUoZGF0YSkpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGNyZWF0ZU1hbnkoeyBkYiwgY29sbGVjdGlvbl9uYW1lLCBhcmdzOiB7IGRhdGEgfSB9KSB7XHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IChkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb25fbmFtZSlcclxuICAgICAgICAgICAgLmluc2VydE1hbnkoZGF0YSkpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZU9uZSh7IGRiLCBjb2xsZWN0aW9uX25hbWUsIHF1ZXJ5IH0pIHtcclxuICAgICAgICByZXR1cm4gYXdhaXQgKGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKVxyXG4gICAgICAgICAgICAuZGVsZXRlT25lKHF1ZXJ5KSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZGVsZXRlTWFueSh7IGRiLCBjb2xsZWN0aW9uX25hbWUsIHF1ZXJ5IH0pIHtcclxuICAgICAgICByZXR1cm4gYXdhaXQgKGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKVxyXG4gICAgICAgICAgICAuZGVsZXRlTWFueShxdWVyeSkpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIHVwZGF0ZU9uZSh7IGRiLCBjb2xsZWN0aW9uX25hbWUsIHF1ZXJ5LCBhcmdzOiB7IHZhbHVlcyB9IH0pIHtcclxuICAgICAgICByZXR1cm4gYXdhaXQgKGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKVxyXG4gICAgICAgICAgICAudXBkYXRlT25lKHF1ZXJ5LCB2YWx1ZXMpKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyB1cGRhdGVNYW55KHsgZGIsIGNvbGxlY3Rpb25fbmFtZSwgcXVlcnksIGFyZ3M6IHsgdmFsdWVzIH0gfSkge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCAoZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uX25hbWUpXHJcbiAgICAgICAgICAgIC51cGRhdGVNYW55KHF1ZXJ5LCB2YWx1ZXMpKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBqb2luKHsgZGIsIGNvbGxlY3Rpb25fbmFtZSwgYXJnczogeyBhZ2dyZWdhdGUgfSB9KSB7XHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IChkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb25fbmFtZSlcclxuICAgICAgICAgICAgLmFnZ3JlZ2F0ZShhZ2dyZWdhdGUpXHJcbiAgICAgICAgICAgIC50b0FycmF5KCkpO1xyXG4gICAgfVxyXG59XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMi5kZWNvcmF0b3JzLmludGVyY2VwdEFzeW5jKHsgYmVmb3JlOiAoXywgYXJncykgPT4gY29uc29sZS5sb2coYEZVTjogR0VUKCR7YXJnc1swXS5jb2xsZWN0aW9uX25hbWV9OiAke0pTT04uc3RyaW5naWZ5KGFyZ3NbMF0ucXVlcnkpfSlgKSB9KSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdF0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIFByb21pc2UpXHJcbl0sIEZ1bmN0aW9ucywgXCJnZXRcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMi5kZWNvcmF0b3JzLmludGVyY2VwdEFzeW5jKHsgYmVmb3JlOiAoXywgYXJncykgPT4gY29uc29sZS5sb2coYEZVTjogR0VUX09ORSgke2FyZ3NbMF0ucXVlcnl9KWApIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgUHJvbWlzZSlcclxuXSwgRnVuY3Rpb25zLCBcImdldE9uZVwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18yLmRlY29yYXRvcnMuaW50ZXJjZXB0QXN5bmMoeyBiZWZvcmU6IChfLCBhcmdzKSA9PiBjb25zb2xlLmxvZyhgRlVOOiBDUkVBVEVfT05FKCR7YXJnc1swXS5hcmdzfSlgKSB9KSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdF0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIFByb21pc2UpXHJcbl0sIEZ1bmN0aW9ucywgXCJjcmVhdGVPbmVcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMi5kZWNvcmF0b3JzLmludGVyY2VwdEFzeW5jKHsgYmVmb3JlOiAoXywgYXJncykgPT4gY29uc29sZS5sb2coYEZVTjogQ1JFQVRFX01BTlkoJHthcmdzWzBdLmFyZ3N9KWApIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgUHJvbWlzZSlcclxuXSwgRnVuY3Rpb25zLCBcImNyZWF0ZU1hbnlcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMi5kZWNvcmF0b3JzLmludGVyY2VwdEFzeW5jKHsgYmVmb3JlOiAoXywgYXJncykgPT4gY29uc29sZS5sb2coYEZVTjogREVMRVRFX09ORSgke2FyZ3NbMF0ucXVlcnl9KWApIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgUHJvbWlzZSlcclxuXSwgRnVuY3Rpb25zLCBcImRlbGV0ZU9uZVwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18yLmRlY29yYXRvcnMuaW50ZXJjZXB0QXN5bmMoeyBiZWZvcmU6IChfLCBhcmdzKSA9PiBjb25zb2xlLmxvZyhgRlVOOiBERUxFVEVfTUFOWSgke2FyZ3NbMF0ucXVlcnl9KWApIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgUHJvbWlzZSlcclxuXSwgRnVuY3Rpb25zLCBcImRlbGV0ZU1hbnlcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMi5kZWNvcmF0b3JzLmludGVyY2VwdEFzeW5jKHsgYmVmb3JlOiAoXywgYXJncykgPT4gY29uc29sZS5sb2coYEZVTjogVVBEQVRFX09ORSgke2FyZ3NbMF0ucXVlcnl9KWApIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgUHJvbWlzZSlcclxuXSwgRnVuY3Rpb25zLCBcInVwZGF0ZU9uZVwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18yLmRlY29yYXRvcnMuaW50ZXJjZXB0QXN5bmMoeyBiZWZvcmU6IChfLCBhcmdzKSA9PiBjb25zb2xlLmxvZyhgRlVOOiBVUERBVEVfTUFOWSgke2FyZ3NbMF0ucXVlcnl9KWApIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgUHJvbWlzZSlcclxuXSwgRnVuY3Rpb25zLCBcInVwZGF0ZU1hbnlcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMi5kZWNvcmF0b3JzLmludGVyY2VwdEFzeW5jKHsgYmVmb3JlOiAoXywgYXJncykgPT4gY29uc29sZS5sb2coYEZVTjogSk9JTigke2FyZ3NbMF0uYXJnc30pYCkgfSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBQcm9taXNlKVxyXG5dLCBGdW5jdGlvbnMsIFwiam9pblwiLCBudWxsKTtcclxuZXhwb3J0cy5GdW5jdGlvbnMgPSBGdW5jdGlvbnM7XHJcbmNsYXNzIERCIHtcclxuICAgIGNvbnN0cnVjdG9yKHVybCwgZGF0YWJhc2UpIHtcclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgICAgICB0aGlzLmRhdGFiYXNlID0gZGF0YWJhc2U7XHJcbiAgICB9XHJcbiAgICBhc3luYyBnZXREQkNvbm5lY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG1vbmdvZGJfMS5Nb25nb0NsaWVudC5jb25uZWN0KHRoaXMudXJsLCB7IHVzZU5ld1VybFBhcnNlcjogdHJ1ZSwgdXNlVW5pZmllZFRvcG9sb2d5OiB0cnVlIH0pO1xyXG4gICAgfVxyXG4gICAgO1xyXG4gICAgYXN5bmMgZXhlY1F1ZXJ5KGZ1bmMsIGNvbGxlY3Rpb25fbmFtZSwgcXVlcnksIGFyZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IHRoaXMuZ2V0REJDb25uZWN0aW9uKCk7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmdW5jKHsgZGI6IGNsaWVudC5kYih0aGlzLmRhdGFiYXNlKSwgY29sbGVjdGlvbl9uYW1lLCBxdWVyeSwgLi4uYXJncyB9KTtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICB9XHJcbiAgICA7XHJcbiAgICBhc3luYyBnZXRDb2xsZWN0aW9ucyhvbkRvbmUpIHtcclxuICAgICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCB0aGlzLmdldERCQ29ubmVjdGlvbigpO1xyXG4gICAgICAgIGNvbnN0IGRiID0gY2xpZW50LmRiKHRoaXMuZGF0YWJhc2UpO1xyXG4gICAgICAgIGNvbnN0IGNvbGxzID0gZGIubGlzdENvbGxlY3Rpb25zKHt9LCB7IG5hbWVPbmx5OiB0cnVlIH0pO1xyXG4gICAgICAgIGxldCBjb2xsZWN0aW9ucyA9IFtdO1xyXG4gICAgICAgIGF3YWl0IHV0aWxzXzEuYXN5bmNJdGVyYXRlKGNvbGxzLCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2NvbGxlY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbnMucHVzaChpdGVtLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb25Eb25lKGNvbGxlY3Rpb25zKTtcclxuICAgIH1cclxuICAgIDtcclxuICAgIGFzeW5jIGxpc3RlblRvQ2hhbmdlcyhjb2xsZWN0aW9uTmFtZSwgcGlwZWxpbmUgPSBbXSkge1xyXG4gICAgICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IHRoaXMuZ2V0REJDb25uZWN0aW9uKCk7XHJcbiAgICAgICAgY29uc3QgZGIgPSBjbGllbnQuZGIodGhpcy5kYXRhYmFzZSk7XHJcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbk5hbWUpO1xyXG4gICAgICAgIGNvbnN0IHN0cmVhbSA9IGNvbGxlY3Rpb24ud2F0Y2gocGlwZWxpbmUpO1xyXG4gICAgICAgIGNvbnN0IGRiU3RyZWFtID0gbmV3IERCU3RyZWFtKHN0cmVhbSwgY29sbGVjdGlvbk5hbWUsIGFzeW5jIChjb2xsZWN0aW9uTmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5leGVjUXVlcnkoRnVuY3Rpb25zLmdldCwgY29sbGVjdGlvbk5hbWUsIHt9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGRiU3RyZWFtO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIERCU3RyZWFtIHtcclxuICAgIGNvbnN0cnVjdG9yKHN0cmVhbSwgY29sbGVjdGlvbk5hbWUsIGZldGNoRGF0YSkge1xyXG4gICAgICAgIHRoaXMuY29sbGVjdGlvbk5hbWUgPSBjb2xsZWN0aW9uTmFtZTtcclxuICAgICAgICB0aGlzLnN0cmVhbSA9IHN0cmVhbTtcclxuICAgICAgICB0aGlzLnN0cmVhbS5vbignY2hhbmdlJywgKGNoYW5nZWREYXRhKSA9PiAoYXN5bmMgKCkgPT4gdGhpcy5kYXRhQ2hhbmdlZChjaGFuZ2VkRGF0YSkpKCkpO1xyXG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhID0gZmV0Y2hEYXRhO1xyXG4gICAgfVxyXG4gICAgc2V0T25EYXRhQ2hhbmdlZChkYXRhQ2hhbmdlZExpc3RlbmVyKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhQ2hhbmdlZExpc3RlbmVyID0gZGF0YUNoYW5nZWRMaXN0ZW5lcjtcclxuICAgIH1cclxuICAgIGFzeW5jIGRhdGFDaGFuZ2VkKGNoYW5nZWREYXRhKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuZmV0Y2hEYXRhKHRoaXMuY29sbGVjdGlvbk5hbWUpO1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFDaGFuZ2VkTGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhQ2hhbmdlZExpc3RlbmVyKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsb3NlU3RyZWFtKCkge1xyXG4gICAgICAgIChhc3luYyAoKSA9PiBhd2FpdCB0aGlzLnN0cmVhbS5jbG9zZSgpKSgpO1xyXG4gICAgfVxyXG59XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMi5kZWNvcmF0b3JzLmludGVyY2VwdCh7IGJlZm9yZTogKG9iaikgPT4gY29uc29sZS5sb2coYERCUzogTGlzdGVuaW5nIGZyb20gZGF0YSBpbiAke29iai5jb2xsZWN0aW9uTmFtZX1gKSB9KSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW0Z1bmN0aW9uXSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBEQlN0cmVhbS5wcm90b3R5cGUsIFwic2V0T25EYXRhQ2hhbmdlZFwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18yLmRlY29yYXRvcnMuaW50ZXJjZXB0QXN5bmMoeyBiZWZvcmU6IChvYmopID0+IGNvbnNvbGUubG9nKGBEQlM6IERhdGEgY2hhbmdlZCBpbiAke29iai5jb2xsZWN0aW9uTmFtZX1gKSB9KSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdF0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIFByb21pc2UpXHJcbl0sIERCU3RyZWFtLnByb3RvdHlwZSwgXCJkYXRhQ2hhbmdlZFwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18yLmRlY29yYXRvcnMuaW50ZXJjZXB0KHsgYWZ0ZXI6IChvYmopID0+IGNvbnNvbGUubG9nKGBEQlM6IENsb3NlZCBTdHJlYW0gJHtvYmouY29sbGVjdGlvbk5hbWV9YCkgfSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCB2b2lkIDApXHJcbl0sIERCU3RyZWFtLnByb3RvdHlwZSwgXCJjbG9zZVN0cmVhbVwiLCBudWxsKTtcclxuZXhwb3J0cy5EQlN0cmVhbSA9IERCU3RyZWFtO1xyXG5jb25zdCBpbnN0YW5jZSA9IG5ldyBEQih1cmwsIGRiTmFtZSk7XHJcbk9iamVjdC5mcmVlemUoaW5zdGFuY2UpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBpbnN0YW5jZTtcclxuIl19