"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mongodb_1 = require("mongodb");

var utils_1 = require("./utils");

var url = utils_1.getEnvVar('MONGODB_URI');
var dbName = 'kyllur';
console.log('MDB:', url, dbName);
;

var doResolve = function doResolve(resolve) {
  return function (err, data) {
    if (err) throw err;
    resolve(data);
  };
};

var doTry = function doTry(reject, fun) {
  try {
    fun();
  } catch (error) {
    reject(error);
  }
};

var getDBConnection = function getDBConnection(cbk) {
  mongodb_1.MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, doResolve(cbk));
};

var iterate = function iterate(cursor, cbk) {
  var actual;
  return _regenerator["default"].async(function iterate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _regenerator["default"].awrap(cursor.next());

        case 2:
          actual = _context.sent;

        case 3:
          if (!actual) {
            _context.next = 10;
            break;
          }

          cbk(actual);
          _context.next = 7;
          return _regenerator["default"].awrap(cursor.next());

        case 7:
          actual = _context.sent;
          _context.next = 3;
          break;

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.functions = {
  get: function get(_ref) {
    var resolve = _ref.resolve,
        reject = _ref.reject,
        db = _ref.db,
        collection_name = _ref.collection_name,
        query = _ref.query,
        _ref$args = _ref.args,
        args = _ref$args === void 0 ? {
      limit: 10000,
      sort: {}
    } : _ref$args;
    doTry(reject, function () {
      db.collection(collection_name).find(query).sort(args.sort).limit(args.limit).toArray(doResolve(resolve));
    });
  },
  getOne: function getOne(_ref2) {
    var resolve = _ref2.resolve,
        reject = _ref2.reject,
        db = _ref2.db,
        collection_name = _ref2.collection_name,
        query = _ref2.query;
    doTry(reject, function () {
      db.collection(collection_name).findOne(query, doResolve(resolve));
    });
  },
  createOne: function createOne(_ref3) {
    var resolve = _ref3.resolve,
        reject = _ref3.reject,
        db = _ref3.db,
        collection_name = _ref3.collection_name,
        data = _ref3.args.data;
    doTry(reject, function () {
      db.collection(collection_name).insertOne(data, doResolve(resolve));
    });
  },
  createMany: function createMany(_ref4) {
    var resolve = _ref4.resolve,
        reject = _ref4.reject,
        db = _ref4.db,
        collection_name = _ref4.collection_name,
        data = _ref4.args.data;
    doTry(reject, function () {
      db.collection(collection_name).insertMany(data, doResolve(resolve));
    });
  },
  deleteOne: function deleteOne(_ref5) {
    var resolve = _ref5.resolve,
        reject = _ref5.reject,
        db = _ref5.db,
        collection_name = _ref5.collection_name,
        query = _ref5.query;
    doTry(reject, function () {
      db.collection(collection_name).deleteOne(query, doResolve(resolve));
    });
  },
  deleteMany: function deleteMany(_ref6) {
    var resolve = _ref6.resolve,
        reject = _ref6.reject,
        db = _ref6.db,
        collection_name = _ref6.collection_name,
        query = _ref6.query;
    doTry(reject, function () {
      db.collection(collection_name).deleteMany(query, doResolve(resolve));
    });
  },
  updateOne: function updateOne(_ref7) {
    var resolve = _ref7.resolve,
        reject = _ref7.reject,
        db = _ref7.db,
        collection_name = _ref7.collection_name,
        query = _ref7.query,
        values = _ref7.args.values;
    doTry(reject, function () {
      db.collection(collection_name).updateOne(query, values, doResolve(resolve));
    });
  },
  updateMany: function updateMany(_ref8) {
    var resolve = _ref8.resolve,
        reject = _ref8.reject,
        db = _ref8.db,
        collection_name = _ref8.collection_name,
        query = _ref8.query,
        values = _ref8.args.values;
    doTry(reject, function () {
      db.collection(collection_name).updateMany(query, values, doResolve(resolve));
    });
  },
  join: function join(_ref9) {
    var resolve = _ref9.resolve,
        reject = _ref9.reject,
        db = _ref9.db,
        collection_name = _ref9.collection_name,
        aggregate = _ref9.args.aggregate;
    doTry(reject, function () {
      db.collection(collection_name).aggregate(aggregate).toArray(doResolve(resolve));
    });
  }
};

function execQuery(func, collection_name, query) {
  var args,
      _args2 = arguments;
  return _regenerator["default"].async(function execQuery$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          args = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {};
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            doTry(reject, function () {
              getDBConnection(function (client) {
                func(_objectSpread({
                  resolve: resolve,
                  reject: reject,
                  db: client.db(dbName),
                  collection_name: collection_name,
                  query: query
                }, args));
              });
            });
          }));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}

exports.execQuery = execQuery;
;

exports.getCollections = function (onDone) {
  getDBConnection(function (client) {
    var db = client.db(dbName);
    var colls = db.listCollections({}, {
      nameOnly: true
    });

    (function _callee() {
      var collections;
      return _regenerator["default"].async(function _callee$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              collections = [];
              _context3.next = 3;
              return _regenerator["default"].awrap(iterate(colls, function (item) {
                if (item) {
                  if (item.type === 'collection') {
                    collections.push(item.name);
                  }
                }
              }));

            case 3:
              onDone(collections);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      });
    })();
  });
};

exports.listenToChanges = function (_ref10) {
  var collectionName = _ref10.collectionName,
      _ref10$pipeline = _ref10.pipeline,
      pipeline = _ref10$pipeline === void 0 ? [] : _ref10$pipeline,
      onChange = _ref10.onChange,
      _ref10$onReady = _ref10.onReady,
      onReady = _ref10$onReady === void 0 ? function () {} : _ref10$onReady;
  getDBConnection(function (client) {
    var db = client.db(dbName);
    var collection = db.collection(collectionName);
    var stream = collection.watch(pipeline);
    console.log('MDB:', 'Listening to changes on mongo', collectionName, pipeline);
    stream.on('change', function (changedData) {
      console.log('MDB:', 'Data change', changedData.operationType);

      (function _callee2() {
        var data;
        return _regenerator["default"].async(function _callee2$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _regenerator["default"].awrap(execQuery(exports.functions.get, collectionName, {}));

              case 2:
                data = _context4.sent;
                onChange(data);

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        });
      })();
    });
    onReady(stream);
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3RzL3V0aWxzL2RiMy5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsIm1vbmdvZGJfMSIsInJlcXVpcmUiLCJ1dGlsc18xIiwidXJsIiwiZ2V0RW52VmFyIiwiZGJOYW1lIiwiY29uc29sZSIsImxvZyIsImRvUmVzb2x2ZSIsInJlc29sdmUiLCJlcnIiLCJkYXRhIiwiZG9UcnkiLCJyZWplY3QiLCJmdW4iLCJlcnJvciIsImdldERCQ29ubmVjdGlvbiIsImNiayIsIk1vbmdvQ2xpZW50IiwiY29ubmVjdCIsInVzZU5ld1VybFBhcnNlciIsInVzZVVuaWZpZWRUb3BvbG9neSIsIml0ZXJhdGUiLCJjdXJzb3IiLCJuZXh0IiwiYWN0dWFsIiwiZnVuY3Rpb25zIiwiZ2V0IiwiZGIiLCJjb2xsZWN0aW9uX25hbWUiLCJxdWVyeSIsImFyZ3MiLCJsaW1pdCIsInNvcnQiLCJjb2xsZWN0aW9uIiwiZmluZCIsInRvQXJyYXkiLCJnZXRPbmUiLCJmaW5kT25lIiwiY3JlYXRlT25lIiwiaW5zZXJ0T25lIiwiY3JlYXRlTWFueSIsImluc2VydE1hbnkiLCJkZWxldGVPbmUiLCJkZWxldGVNYW55IiwidXBkYXRlT25lIiwidmFsdWVzIiwidXBkYXRlTWFueSIsImpvaW4iLCJhZ2dyZWdhdGUiLCJleGVjUXVlcnkiLCJmdW5jIiwiUHJvbWlzZSIsImNsaWVudCIsImdldENvbGxlY3Rpb25zIiwib25Eb25lIiwiY29sbHMiLCJsaXN0Q29sbGVjdGlvbnMiLCJuYW1lT25seSIsImNvbGxlY3Rpb25zIiwiaXRlbSIsInR5cGUiLCJwdXNoIiwibmFtZSIsImxpc3RlblRvQ2hhbmdlcyIsImNvbGxlY3Rpb25OYW1lIiwicGlwZWxpbmUiLCJvbkNoYW5nZSIsIm9uUmVhZHkiLCJzdHJlYW0iLCJ3YXRjaCIsIm9uIiwiY2hhbmdlZERhdGEiLCJvcGVyYXRpb25UeXBlIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7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QkosUUFBakIsQ0FBZjtBQUNBNUQsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksTUFBWixFQUFvQiwrQkFBcEIsRUFBcUQwRCxjQUFyRCxFQUFxRUMsUUFBckU7QUFDQUcsSUFBQUEsTUFBTSxDQUFDRSxFQUFQLENBQVUsUUFBVixFQUFvQixVQUFDQyxXQUFELEVBQWlCO0FBQ2pDbEUsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksTUFBWixFQUFvQixhQUFwQixFQUFtQ2lFLFdBQVcsQ0FBQ0MsYUFBL0M7O0FBQ0EsT0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFEQUNzQnZCLFNBQVMsQ0FBQ3BELE9BQU8sQ0FBQzRCLFNBQVIsQ0FBa0JDLEdBQW5CLEVBQXdCc0MsY0FBeEIsRUFBd0MsRUFBeEMsQ0FEL0I7O0FBQUE7QUFDU3RELGdCQUFBQSxJQURUO0FBRUd3RCxnQkFBQUEsUUFBUSxDQUFDeEQsSUFBRCxDQUFSOztBQUZIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQUQ7QUFJSCxLQU5EO0FBT0F5RCxJQUFBQSxPQUFPLENBQUNDLE1BQUQsQ0FBUDtBQUNILEdBYmMsQ0FBZjtBQWNILENBZkQiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBtb25nb2RiXzEgPSByZXF1aXJlKFwibW9uZ29kYlwiKTtcclxuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xyXG5jb25zdCB1cmwgPSB1dGlsc18xLmdldEVudlZhcignTU9OR09EQl9VUkknKTtcclxuY29uc3QgZGJOYW1lID0gJ2t5bGx1cic7XHJcbmNvbnNvbGUubG9nKCdNREI6JywgdXJsLCBkYk5hbWUpO1xyXG47XHJcbmNvbnN0IGRvUmVzb2x2ZSA9IChyZXNvbHZlKSA9PiB7XHJcbiAgICByZXR1cm4gKGVyciwgZGF0YSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpXHJcbiAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgfTtcclxufTtcclxuY29uc3QgZG9UcnkgPSAocmVqZWN0LCBmdW4pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgZnVuKCk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgfVxyXG59O1xyXG5jb25zdCBnZXREQkNvbm5lY3Rpb24gPSAoY2JrKSA9PiB7XHJcbiAgICBtb25nb2RiXzEuTW9uZ29DbGllbnQuY29ubmVjdCh1cmwsIHsgdXNlTmV3VXJsUGFyc2VyOiB0cnVlLCB1c2VVbmlmaWVkVG9wb2xvZ3k6IHRydWUgfSwgZG9SZXNvbHZlKGNiaykpO1xyXG59O1xyXG5jb25zdCBpdGVyYXRlID0gYXN5bmMgKGN1cnNvciwgY2JrKSA9PiB7XHJcbiAgICBsZXQgYWN0dWFsID0gYXdhaXQgY3Vyc29yLm5leHQoKTtcclxuICAgIHdoaWxlIChhY3R1YWwpIHtcclxuICAgICAgICBjYmsoYWN0dWFsKTtcclxuICAgICAgICBhY3R1YWwgPSBhd2FpdCBjdXJzb3IubmV4dCgpO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLmZ1bmN0aW9ucyA9IHtcclxuICAgIGdldCh7IHJlc29sdmUsIHJlamVjdCwgZGIsIGNvbGxlY3Rpb25fbmFtZSwgcXVlcnksIGFyZ3MgPSB7IGxpbWl0OiAxMDAwMCwgc29ydDoge30gfSB9KSB7XHJcbiAgICAgICAgZG9UcnkocmVqZWN0LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKVxyXG4gICAgICAgICAgICAgICAgLmZpbmQocXVlcnkpXHJcbiAgICAgICAgICAgICAgICAuc29ydChhcmdzLnNvcnQpXHJcbiAgICAgICAgICAgICAgICAubGltaXQoYXJncy5saW1pdClcclxuICAgICAgICAgICAgICAgIC50b0FycmF5KGRvUmVzb2x2ZShyZXNvbHZlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0T25lKHsgcmVzb2x2ZSwgcmVqZWN0LCBkYiwgY29sbGVjdGlvbl9uYW1lLCBxdWVyeSB9KSB7XHJcbiAgICAgICAgZG9UcnkocmVqZWN0LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKVxyXG4gICAgICAgICAgICAgICAgLmZpbmRPbmUocXVlcnksIGRvUmVzb2x2ZShyZXNvbHZlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlT25lKHsgcmVzb2x2ZSwgcmVqZWN0LCBkYiwgY29sbGVjdGlvbl9uYW1lLCBhcmdzOiB7IGRhdGEgfSB9KSB7XHJcbiAgICAgICAgZG9UcnkocmVqZWN0LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKVxyXG4gICAgICAgICAgICAgICAgLmluc2VydE9uZShkYXRhLCBkb1Jlc29sdmUocmVzb2x2ZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZU1hbnkoeyByZXNvbHZlLCByZWplY3QsIGRiLCBjb2xsZWN0aW9uX25hbWUsIGFyZ3M6IHsgZGF0YSB9IH0pIHtcclxuICAgICAgICBkb1RyeShyZWplY3QsICgpID0+IHtcclxuICAgICAgICAgICAgZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uX25hbWUpXHJcbiAgICAgICAgICAgICAgICAuaW5zZXJ0TWFueShkYXRhLCBkb1Jlc29sdmUocmVzb2x2ZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGRlbGV0ZU9uZSh7IHJlc29sdmUsIHJlamVjdCwgZGIsIGNvbGxlY3Rpb25fbmFtZSwgcXVlcnkgfSkge1xyXG4gICAgICAgIGRvVHJ5KHJlamVjdCwgKCkgPT4ge1xyXG4gICAgICAgICAgICBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb25fbmFtZSlcclxuICAgICAgICAgICAgICAgIC5kZWxldGVPbmUocXVlcnksIGRvUmVzb2x2ZShyZXNvbHZlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZGVsZXRlTWFueSh7IHJlc29sdmUsIHJlamVjdCwgZGIsIGNvbGxlY3Rpb25fbmFtZSwgcXVlcnkgfSkge1xyXG4gICAgICAgIGRvVHJ5KHJlamVjdCwgKCkgPT4ge1xyXG4gICAgICAgICAgICBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb25fbmFtZSlcclxuICAgICAgICAgICAgICAgIC5kZWxldGVNYW55KHF1ZXJ5LCBkb1Jlc29sdmUocmVzb2x2ZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZU9uZSh7IHJlc29sdmUsIHJlamVjdCwgZGIsIGNvbGxlY3Rpb25fbmFtZSwgcXVlcnksIGFyZ3M6IHsgdmFsdWVzIH0gfSkge1xyXG4gICAgICAgIGRvVHJ5KHJlamVjdCwgKCkgPT4ge1xyXG4gICAgICAgICAgICBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb25fbmFtZSlcclxuICAgICAgICAgICAgICAgIC51cGRhdGVPbmUocXVlcnksIHZhbHVlcywgZG9SZXNvbHZlKHJlc29sdmUpKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGVNYW55KHsgcmVzb2x2ZSwgcmVqZWN0LCBkYiwgY29sbGVjdGlvbl9uYW1lLCBxdWVyeSwgYXJnczogeyB2YWx1ZXMgfSB9KSB7XHJcbiAgICAgICAgZG9UcnkocmVqZWN0LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKVxyXG4gICAgICAgICAgICAgICAgLnVwZGF0ZU1hbnkocXVlcnksIHZhbHVlcywgZG9SZXNvbHZlKHJlc29sdmUpKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBqb2luKHsgcmVzb2x2ZSwgcmVqZWN0LCBkYiwgY29sbGVjdGlvbl9uYW1lLCBhcmdzOiB7IGFnZ3JlZ2F0ZSB9IH0pIHtcclxuICAgICAgICBkb1RyeShyZWplY3QsICgpID0+IHtcclxuICAgICAgICAgICAgZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uX25hbWUpXHJcbiAgICAgICAgICAgICAgICAuYWdncmVnYXRlKGFnZ3JlZ2F0ZSlcclxuICAgICAgICAgICAgICAgIC50b0FycmF5KGRvUmVzb2x2ZShyZXNvbHZlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcbmFzeW5jIGZ1bmN0aW9uIGV4ZWNRdWVyeShmdW5jLCBjb2xsZWN0aW9uX25hbWUsIHF1ZXJ5LCBhcmdzID0ge30pIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgZG9UcnkocmVqZWN0LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGdldERCQ29ubmVjdGlvbihjbGllbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgZnVuYyh7IHJlc29sdmUsIHJlamVjdCwgZGI6IGNsaWVudC5kYihkYk5hbWUpLCBjb2xsZWN0aW9uX25hbWUsIHF1ZXJ5LCAuLi5hcmdzIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuZXhlY1F1ZXJ5ID0gZXhlY1F1ZXJ5O1xyXG47XHJcbmV4cG9ydHMuZ2V0Q29sbGVjdGlvbnMgPSAob25Eb25lKSA9PiB7XHJcbiAgICBnZXREQkNvbm5lY3Rpb24oY2xpZW50ID0+IHtcclxuICAgICAgICBjb25zdCBkYiA9IGNsaWVudC5kYihkYk5hbWUpO1xyXG4gICAgICAgIGNvbnN0IGNvbGxzID0gZGIubGlzdENvbGxlY3Rpb25zKHt9LCB7IG5hbWVPbmx5OiB0cnVlIH0pO1xyXG4gICAgICAgIChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjb2xsZWN0aW9ucyA9IFtdO1xyXG4gICAgICAgICAgICBhd2FpdCBpdGVyYXRlKGNvbGxzLCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS50eXBlID09PSAnY29sbGVjdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbnMucHVzaChpdGVtLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG9uRG9uZShjb2xsZWN0aW9ucyk7XHJcbiAgICAgICAgfSkoKTtcclxuICAgIH0pO1xyXG59O1xyXG5leHBvcnRzLmxpc3RlblRvQ2hhbmdlcyA9ICh7IGNvbGxlY3Rpb25OYW1lLCBwaXBlbGluZSA9IFtdLCBvbkNoYW5nZSwgb25SZWFkeSA9ICgpID0+IHsgfSB9KSA9PiB7XHJcbiAgICBnZXREQkNvbm5lY3Rpb24oY2xpZW50ID0+IHtcclxuICAgICAgICBjb25zdCBkYiA9IGNsaWVudC5kYihkYk5hbWUpO1xyXG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb25OYW1lKTtcclxuICAgICAgICBjb25zdCBzdHJlYW0gPSBjb2xsZWN0aW9uLndhdGNoKHBpcGVsaW5lKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnTURCOicsICdMaXN0ZW5pbmcgdG8gY2hhbmdlcyBvbiBtb25nbycsIGNvbGxlY3Rpb25OYW1lLCBwaXBlbGluZSk7XHJcbiAgICAgICAgc3RyZWFtLm9uKCdjaGFuZ2UnLCAoY2hhbmdlZERhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ01EQjonLCAnRGF0YSBjaGFuZ2UnLCBjaGFuZ2VkRGF0YS5vcGVyYXRpb25UeXBlKTtcclxuICAgICAgICAgICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBleGVjUXVlcnkoZXhwb3J0cy5mdW5jdGlvbnMuZ2V0LCBjb2xsZWN0aW9uTmFtZSwge30pO1xyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2UoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb25SZWFkeShzdHJlYW0pO1xyXG4gICAgfSk7XHJcbn07XHJcbiJdfQ==